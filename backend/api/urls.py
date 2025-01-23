from django.urls import path
from . import views

urlpatterns = [
    path("inquiries/", views.InquiryListCreate.as_view(), name="inquiry-list"),
    path("inquiries/delete/<int:pk>/", views.InquiryDelete.as_view(), name="delete-inquiry"),
]