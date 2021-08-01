import math

from django.core.paginator import Paginator
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .serializers import ItemSerializer, ItemsSerializer, \
    AddressSerializer, \
    OrderSerializer, SlideSerializer, BookmarkSerializer, UserSetSerializer, \
    CommentSerializer, CategorySerializer, BrandSerializer
from itertools import chain
from .models import Item, Address, OrderItem, Order, \
    Slide, Bookmark, SubCategory, Category, Comment, Brand, Color
from collections import namedtuple
from accounts.models import UserAccount
from rest_framework.permissions import AllowAny, IsAuthenticated
from djoser.compat import get_user_email
from djoser.conf import settings


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def bookmarkList(request, pk, sk):
    bookmark_list = Bookmark.objects.filter(user=pk)
    itemperpage = 4
    paginator = Paginator(bookmark_list, itemperpage)
    count = math.ceil(len(bookmark_list) / itemperpage)
    bookmark_list = paginator.get_page(sk)
    serializer = BookmarkSerializer(bookmark_list, many=True)
    new_dict = {"count": count}
    new_dict.update({"items": serializer.data})
    return Response(new_dict)


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
    sort = request.data.get('sort')
    brand = request.data.get('brand')
    keyword = request.data.get('keyword')
    category = request.data.get('category')
    subcategory = request.data.get('subcategory')
    if keyword:
        if brand:
            br = Brand.objects.get(title=brand)
            items = Item.objects.filter(title__contains=keyword, brand=br.id, is_active=True).exclude(stock_no=0)
            items_inactive = Item.objects.filter(title__contains=keyword, brand=br.id, stock_no=0, is_active=True)
        else:
            items = Item.objects.filter(title__contains=keyword, is_active=True).exclude(stock_no=0)
            items_inactive = Item.objects.filter(title__contains=keyword, stock_no=0, is_active=True)
    elif subcategory:
        sub = SubCategory.objects.get(title=subcategory)
        if brand:
            br = Brand.objects.get(title=brand)
            items = Item.objects.filter(subcategory=sub.id, brand=br.id, is_active=True).exclude(stock_no=0)
            items_inactive = Item.objects.filter(subcategory=sub.id, brand=br.id, stock_no=0, is_active=True)
        else:
            items = Item.objects.filter(subcategory=sub.id, is_active=True).exclude(stock_no=0)
            items_inactive = Item.objects.filter(subcategory=sub.id, stock_no=0, is_active=True)

    elif category:
        cat = Category.objects.get(title=category)
        if brand:
            br = Brand.objects.get(title=brand)
            items = Item.objects.filter(category=cat.id, brand=br.id, is_active=True).exclude(stock_no=0)
            items_inactive = Item.objects.filter(category=cat.id, brand=br.id, stock_no=0, is_active=True)
        else:
            items = Item.objects.filter(category=cat.id, is_active=True).exclude(stock_no=0)
            items_inactive = Item.objects.filter(category=cat.id, stock_no=0, is_active=True)
    else:
        if brand:
            br = Brand.objects.get(title=brand)
            items = Item.objects.filter(is_active=True, brand=br.id,).exclude(stock_no=0)
            items_inactive = Item.objects.filter(stock_no=0, brand=br.id, is_active=True)
        else:
            items = Item.objects.filter(is_active=True).exclude(stock_no=0)
            items_inactive = Item.objects.filter(stock_no=0, is_active=True)

    if sort:
        items = items.order_by(sort)
        items_inactive = items_inactive.order_by(sort)
    else:
        items = items.order_by('-add_date')
        items_inactive = items_inactive.order_by('-add_date')

    items = list(chain(items, items_inactive))
    itemperpage = 6
    paginator = Paginator(items, itemperpage)
    count = math.ceil(len(items) / itemperpage)
    items = paginator.get_page(pk)
    serializer = ItemsSerializer(items, many=True)
    new_dict = {"count": count}
    new_dict.update({"items": serializer.data})
    return Response(new_dict)


@api_view(['POST'])
@permission_classes([AllowAny])
def itemDetail(request, pk):
    item = Item.objects.get(id=pk)
    item.view += 1
    item.save()
    serializer = ItemSerializer(item, many=False)
    bookmarked = False
    if request.data.get('user'):
        user = UserAccount.objects.get(id=request.data.get('user'))
        query = Bookmark.objects.filter(user=user, item=item)
        if query.exists():
            bookmarked = True
    new_dict = {"bookmarked": bookmarked}
    new_dict.update(serializer.data)
    return Response(new_dict)


@api_view(['GET'])
@permission_classes([AllowAny])
def commentList(request, pk, sk):
    comment_list = Comment.objects.filter(item=pk)  # , confirmed=True
    itemperpage = 4
    paginator = Paginator(comment_list, itemperpage)
    count = math.ceil(len(comment_list) / itemperpage)
    comment_list = paginator.get_page(sk)
    serializer = CommentSerializer(comment_list, many=True)
    new_dict = {"count": count}
    new_dict.update({"comments": serializer.data})
    return Response(new_dict)


@api_view(['POST'])
@permission_classes([AllowAny])
def comment(request):
    item = get_object_or_404(Item, id=request.data.get('item'))
    user = UserAccount.objects.get(id=request.data.get('user'))
    comment_new, created = Comment.objects.get_or_create(item=item, user=user)
    serializer = CommentSerializer(instance=comment_new, data=request.data)
    if serializer.is_valid():
        serializer.save()
        comment_list = Comment.objects.filter(item=request.data.get('item'))  # i should move this part to confirm
        item.star = ((item.star * (len(comment_list) - 1)) + float(request.data.get('star'))) / len(comment_list)
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


# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def userDetail(request, pk):
#     user = UserAccount.objects.get(id=pk)
#     serializer = UserDetailSerializer(user, many=False)
#     return Response(serializer.data)


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
@permission_classes([AllowAny])
def orderDetail(request, pk):
    order = Order.objects.filter(user=pk)
    items = OrderItem.objects.filter(user=pk, ordered=False)
    for item in items:
        if item.item.stock_no < 1:
            item.delete()
    serializer = OrderSerializer(order, many=True)
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
    c = request.data.get('color')
    if c:
        color = Color.objects.get(id=request.data.get('color'))
        order_item, created = OrderItem.objects.get_or_create(item=item, color=color, user=user, ordered=False)
    else:
        order_item, created = OrderItem.objects.get_or_create(item=item, user=user, ordered=False)
    order_qs = Order.objects.filter(user=request.data.get('user'), seller=item.user, ordered=False)
    if order_qs.exists():
        order = order_qs[0]
        if order.items.filter(item__id=pk, color=c).exists():
            order_item.quantity += 1
            order_item.save()
            order = Order.objects.filter(user=user)
            serializer = OrderSerializer(order, many=True)
            return Response(serializer.data)
        else:
            order.items.add(order_item)
            order = Order.objects.filter(user=user)
            serializer = OrderSerializer(order, many=True)
            return Response(serializer.data)
    else:
        ordered_date = timezone.now()
        order = Order.objects.create(user=user, ordered_date=ordered_date)
        order.items.add(order_item)
        order = Order.objects.filter(seller=item.user, user=user)
        serializer = OrderSerializer(order, many=True)
        return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cartRemove(request, pk):
    item = get_object_or_404(Item, id=pk)
    user = UserAccount.objects.get(id=request.data.get('user'))
    order_qs = Order.objects.filter(user=user, seller=item.user, ordered=False)
    if order_qs.exists():
        order = order_qs[0]
        # check if the order item is in the order
        if order.items.filter(item__id=item.pk).exists():
            order_item = OrderItem.objects.get(item=item, user=user, ordered=False)
            # order.items.remove(order_item)
            order_item.delete()
            order = Order.objects.filter( user=user)
            serializer = OrderSerializer(order, many=True)
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
    order_qs = Order.objects.filter(user=user, seller=item.user, ordered=False)
    if order_qs.exists():
        order = order_qs[0]
        # check if the order item is in the order
        if order.items.filter(item__id=item.pk).exists():
            c = request.data.get('color')
            if c:
                color = Color.objects.get(id=request.data.get('color'))
                order_item = OrderItem.objects.get(item=item, color=color, user=user, ordered=False)
            else:
                order_item = OrderItem.objects.get(item=item, user=user, ordered=False)
            if order_item.quantity > 1:
                order_item.quantity -= 1
                order_item.save()
                order = Order.objects.filter(user=user)
                serializer = OrderSerializer(order, many=True)
                return Response(serializer.data)
            else:
                order.items.remove(order_item)
                order_item.delete()
                order = Order.objects.filter(user=user)
                serializer = OrderSerializer(order, many=True)
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


@api_view(['GET'])
@permission_classes([AllowAny])
def menuList(request):
    cat = Category.objects.filter(is_active=True)
    serializer = CategorySerializer(cat, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([AllowAny])
def brandList(request):
    category = request.data.get('category')
    subcategory = request.data.get('subcategory')
    if category:
        cat = Category.objects.get(title=category)
        brand = Brand.objects.filter(category=cat.id, is_active=True)
    elif subcategory:
        sub = SubCategory.objects.get(title=subcategory)
        brand = Brand.objects.filter(subcategory=sub.id, is_active=True)
    else:
        brand = Brand.objects.filter(is_active=True)
    serializer = BrandSerializer(brand, many=True)
    return Response(serializer.data)



    # context = {"user": user}
    # to = [get_user_email(user)]
    # settings.EMAIL.ordered(request, context).send(to)
