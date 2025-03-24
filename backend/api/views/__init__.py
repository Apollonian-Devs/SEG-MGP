from .auth_views import CreateUserView, CurrentUserView
from .ticket_views import (
    TicketListCreate, TicketDelete, TicketSendResponseView, TicketChangeStatus,
    TicketChangePriority, TicketMessageHistory, TicketRedirectView,
    TicketStatusHistoryView, TicketPathView, ChangeTicketDateView
)
from .user_views import UserTicketsView, UserNotificationsView, AllOfficersView
from .department_views import DepartmentsListView, SuggestDepartmentView
from .analytics_views import GroupTicketsView