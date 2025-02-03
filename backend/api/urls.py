from django.urls import path
from . import views

urlpatterns = [
    path("tickets/", views.TicketListCreate.as_view(), name="ticket-list"),
    path("tickets/delete/<int:pk>/", views.TicketDelete.as_view(), name="delete-ticket"),
    path('current_user/', views.CurrentUserView.as_view(), name='current-user'),
    path("user-tickets/", views.UserTicketsView.as_view(), name="user-tickets"),
    path('tickets/<int:ticket_id>/messages/', views.TicketMessageHistory.as_view(), name='ticket-messages'),
    path("tickets/<int:ticket_id>/messages/post/", views.TicketSendResponseView.as_view(), name="send-ticket"),


]
