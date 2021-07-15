import math

from django.core.paginator import Paginator
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .serializers import ItemSerializer, ItemsSerializer, \
    UserDetailSerializer, AddressSerializer, CartSerializer, \
    OrderFullSerializer, SlideSerializer, BookmarkSerializer, UserSetSerializer, CommentSerializer
from .models import Item, Images, Address, OrderItem, Order, \
    Slide, Bookmark, SubCategory, Category, Comment
from collections import namedtuple
from accounts.models import UserAccount
from rest_framework.permissions import AllowAny, IsAuthenticated


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def bookmarkList(request, pk):
    bookmark_list = Bookmark.objects.filter(user=pk)
    serializer = BookmarkSerializer(bookmark_list, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def addressList(request, pk):
    address_list = Address.objects.filter(user=pk)
    serializer = AddressSerializer(address_list, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def address(request):
    user = UserAccount.objects.get(id=request.data.get('user'))
    query = Address.objects.filter(user=user, id=request.data.get('id'))
    if request.data.get('delete'):
        if query.exists():
            address_del = Address.objects.get(id=request.data.get('id'), user=user)
            address_del.delete()
            return Response({"deleted"})
    if query.exists():
        address_edit = Address.objects.get(id=request.data.get('id'))
        serializer = AddressSerializer(instance=address_edit, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)
    else:
        serializer = AddressSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)


@api_view(['POST'])
@permission_classes([AllowAny])
def itemList(request, pk):
    keyword = request.data.get('keyword')
    category = request.data.get('category')
    subcategory = request.data.get('subcategory')
    if keyword:
        items = Item.objects.filter(title__contains=keyword)
    elif subcategory:
        sub = SubCategory.objects.get(title=subcategory)
        items = Item.objects.filter(subcategory=sub.id)
    elif category:
        cat = Category.objects.get(title=category)
        items = Item.objects.filter(category=cat.id)
    else:
        items = Item.objects.all()
    itemperpage = 6
    paginator = Paginator(items, itemperpage)
    count = math.ceil(len(items)/itemperpage)
    items = paginator.get_page(pk)

    serializer = ItemsSerializer(items, many=True)
    res = [{"count": count}] + [serializer.data]
    return Response(res)

@api_view(['GET'])
@permission_classes([AllowAny])
def itemDetail(request, pk):
    item = Item.objects.get(id=pk)
    images = Images.objects.filter(item=pk)
    ItemDetail = namedtuple('Item', ('item', 'images'))
    item_detail = ItemDetail(item, images)
    serializer = ItemSerializer(item_detail, context={"request": request})
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def commentList(request, pk, sk):
    comment_list = Comment.objects.filter(item=pk) #, confirmed=True
    itemperpage = 4
    paginator = Paginator(comment_list, itemperpage)
    count = math.ceil(len(comment_list) / itemperpage)
    comment_list = paginator.get_page(sk)

    serializer = CommentSerializer(comment_list, many=True)
    res = [{"count": count}] + [serializer.data]
    return Response(res)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def comment(request):
    item = get_object_or_404(Item, id=request.data.get('item'))
    user = UserAccount.objects.get(id=request.data.get('user'))
    comment_new, created = Comment.objects.get_or_create(item=item, user=user)
    serializer = CommentSerializer(instance=comment_new, data=request.data)
    if serializer.is_valid():
        serializer.save()
        comment_list = Comment.objects.filter(item=request.data.get('item'))# i should move this part to confirm
        item.star = ((item.star * (len(comment_list) - 1)) + float(request.data.get('star')))/len(comment_list)
        item.save()
        return Response(serializer.data)
    return Response(serializer.errors)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def itemCreate(request):
    serializer = ItemSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def userDetail(request, pk):
    user = UserAccount.objects.get(id=pk)
    serializer = UserDetailSerializer(user, many=False)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def userSet(request):
    user = UserAccount.objects.get(id=request.data.get('id'))
    serializer = UserSetSerializer(instance=user, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def orderDetail(request, pk):
    order = Order.objects.get(user=pk)
    items = OrderItem.objects.filter(user=pk, ordered=False)
    OrderDetail = namedtuple('Order', ('order', 'items'))
    order_detail = OrderDetail(order, items)
    serializer = OrderFullSerializer(order_detail, context={"request": request})
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def bookmark(request):
    bookmark_item = get_object_or_404(Item, id=request.data.get('id'))
    user = UserAccount.objects.get(id=request.data.get('user'))
    query = Bookmark.objects.filter(user=user, item=bookmark_item)
    if query.exists():
        bookmark_del = Bookmark.objects.get(item=bookmark_item, user=user)
        bookmark_del.delete()
        return Response({"deleted"})
    else:
        bookmark_new, created = Bookmark.objects.get_or_create(item=bookmark_item, user=user)
        bookmark_new.save()
        return Response({"created"})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cartAdd(request, pk):
    item = get_object_or_404(Item, id=pk)
    user = UserAccount.objects.get(id=request.data.get('user'))
    order_item, created = OrderItem.objects.get_or_create(item=item, user=user, ordered=False)
    order_qs = Order.objects.filter(user=request.data.get('user'), ordered=False)
    if order_qs.exists():
        order = order_qs[0]
        if order.items.filter(item__id=pk).exists():
            order_item.quantity += 1
            order_item.save()
            order = OrderItem.objects.filter(user=user, ordered=False)
            serializer = CartSerializer(order, many=True)
            return Response(serializer.data)
        else:
            order.items.add(order_item)
            order = OrderItem.objects.filter(user=user, ordered=False)
            serializer = CartSerializer(order, many=True)
            return Response(serializer.data)
    else:
        ordered_date = timezone.now()
        order = Order.objects.create(user=user, ordered_date=ordered_date)
        order.items.add(order_item)
        order = OrderItem.objects.filter(user=user, ordered=False)
        serializer = CartSerializer(order, many=True)
        return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cartRemove(request, pk):
    item = get_object_or_404(Item, id=pk)
    user = UserAccount.objects.get(id=request.data.get('user'))
    order_qs = Order.objects.filter(user=user, ordered=False)
    if order_qs.exists():
        order = order_qs[0]
        # check if the order item is in the order
        if order.items.filter(item__id=item.pk).exists():
            order_item = OrderItem.objects.get(item=item, user=user, ordered=False)
            # order.items.remove(order_item)
            order_item.delete()
            order = OrderItem.objects.filter(user=user, ordered=False)
            serializer = CartSerializer(order, many=True)
            return Response(serializer.data)
        else:
            # add a message saying the user dose not have an order
            return Response({"message": "Item was not in your cart."})
    else:
        # add a message saying the user dose not have an order
        return Response({"message": "u don't have an active order.."})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cartRemoveOne(request, pk):
    item = get_object_or_404(Item, id=pk)
    user = UserAccount.objects.get(id=request.data.get('user'))
    order_qs = Order.objects.filter(user=user, ordered=False)
    if order_qs.exists():
        order = order_qs[0]
        # check if the order item is in the order
        if order.items.filter(item__id=item.pk).exists():
            order_item = OrderItem.objects.get(item=item, user=user, ordered=False)
            if order_item.quantity > 1:
                order_item.quantity -= 1
                order_item.save()
                order = OrderItem.objects.filter(user=user, ordered=False)
                serializer = CartSerializer(order, many=True)
                return Response(serializer.data)
            else:
                order.items.remove(order_item)
                order_item.delete()
                order = OrderItem.objects.filter(user=user, ordered=False)
                serializer = CartSerializer(order, many=True)
                return Response(serializer.data)
        else:
            return Response({"message": "Item was not in your cart."})
    else:
        return Response({"message": "u don't have an active order."})


@api_view(['GET'])
@permission_classes([AllowAny])
def slide(request):
    slides = Slide.objects.filter(is_active=True)
    serializer = SlideSerializer(slides, many=True)
    return Response(serializer.data)

