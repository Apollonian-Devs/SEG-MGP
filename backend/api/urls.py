from django.urls import path
from . import views

urlpatterns = [
    path("tickets/", views.TicketListCreate.as_view(), name="ticket-list"),
    path("tickets/delete/<int:pk>/", views.TicketDelete.as_view(), name="delete-ticket"),
    path("tickets/change-status/<int:id>/", views.TicketChangeStatus.as_view(), name="change-status"),
    path("tickets/change-priority/<int:id>/", views.TicketChangePriority.as_view(), name="change-priority"),
    path('current_user/', views.CurrentUserView.as_view(), name='current-user'),
    path("user-tickets/", views.UserTicketsView.as_view(), name="user-tickets"),
    path('tickets/<int:ticket_id>/messages/', views.TicketMessageHistory.as_view(), name='ticket-messages'),
    path("tickets/<int:ticket_id>/messages/post/", views.TicketSendResponseView.as_view(), name="send-ticket"),
    path("all-officers/", views.AllOfficersView.as_view(), name="all-officers"),
    path("user-notifications/", views.UserNotificationsView.as_view(), name="user-notifications"),
    path("overdue-tickets/", views.OverdueTicketsView.as_view(), name="overdue-tickets"),  
    #path("unanswered-tickets/", views.UnansweredTicketsView.as_view(), name="unanswered-tickets"), 
    path("tickets/change-date", views.ChangeTicketDateView.as_view(), name="change-ticket-date"), 
    path("ticket-status-history/<int:ticket_id>/", views.TicketStatusHistoryView.as_view(), name="ticket-status-history"),
     path("ticket-path/<int:ticket_id>/", views.TicketPathView.as_view(), name="ticket-path"),    
    path("redirect-ticket/", views.TicketRedirectView.as_view(), name="redirect-ticket"),
    path('api/departments/', views.DepartmentsListView.as_view(), name='departments-list'), 
    path('user-tickets-grouping/', views.GroupTicketsView.as_view(), name='user-tickets-grouping'),
    path("suggested-department/", views.SuggestDepartmentView.as_view(), name= "suggest-deparment")

]


