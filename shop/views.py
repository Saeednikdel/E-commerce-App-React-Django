from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .serializers import \
    ItemSerializer, \
    ItemsSerializer, \
    UserDetailSerializer, \
    AddressSerializer, CartSerializer, OrderFullSerializer
from .models import Item, Images, BillingAddress, OrderItem, Order
from collections import namedtuple
from accounts.models import UserAccount
from rest_framework.permissions import AllowAny, IsAuthenticated


@api_view(['GET'])
@permission_classes([AllowAny])
def apiOverview(request):
    api_urls = {
        'list': '/item-list/',
        'detail': 'item-detail/',
    }
    return Response(api_urls)


@api_view(['GET'])
@permission_classes([AllowAny])
def cart(request, pk):
    order = OrderItem.objects.filter(user=pk, ordered=False)
    serializer = CartSerializer(order, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def addressList(request, pk):
    address = BillingAddress.objects.filter(user=pk)
    serializer = AddressSerializer(address, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def itemList(request):
    items = Item.objects.all()
    serializer = ItemsSerializer(items, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def itemDetail(request, pk):
    item = Item.objects.get(id=pk)
    images = Images.objects.filter(item=pk)
    ItemDetail = namedtuple('Item', ('item', 'images'))
    item_detail = ItemDetail(item, images)
    serializer = ItemSerializer(item_detail, context={"request": request})
    return Response(serializer.data)


@api_view(['POST'])
def itemCreate(request):
    serializer = ItemSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors)


@api_view(['GET'])
def userDetail(request, pk):
    user = UserAccount.objects.get(id=pk)
    serializer = UserDetailSerializer(user, many=False)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def orderDetail(request, pk):
    order = Order.objects.get(user=pk)
    items = OrderItem.objects.filter(user=pk, ordered=False)
    OrderDetail = namedtuple('Order', ('order', 'items'))
    order_detail = OrderDetail(order, items)
    serializer = OrderFullSerializer(order_detail, context={"request": request})
    return Response(serializer.data)


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
