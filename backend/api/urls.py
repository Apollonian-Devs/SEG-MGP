from django.urls import path
from . import views

urlpatterns = [
    path("tickets/", views.TicketListCreate.as_view(), name="ticket-list"),
    path("tickets/delete/<int:pk>/", views.TicketDelete.as_view(), name="delete-ticket"),
    path('current_user/', views.CurrentUserView.as_view(), name='current-user')
]