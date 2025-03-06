from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import (
    Department,
    Officer,
    Ticket,
    TicketMessage,
    TicketStatusHistory,
    TicketRedirect,
    TicketAttachment,
    AIResponse,
    Notification,
)


class Command(BaseCommand):
    """Command to unseed the database by removing all seeded data."""

    help = "Unseeds the database by removing seeded data."

    def handle(self, *args, **options):
        """Unseed the database correctly in the right order."""
        self.stdout.write(self.style.NOTICE("Unseeding the database..."))

        self.unseed_tickets()  
        self.unseed_notifications() 
        self.unseed_officers() 
        self.unseed_users() 
        self.unseed_departments()  

        self.stdout.write(self.style.SUCCESS("Database unseeding complete!"))

    def unseed_tickets(self):
        """Delete all tickets and related data in correct order."""
        self.stdout.write("Removing tickets and related records...")

        TicketMessage.objects.all().delete()
        TicketStatusHistory.objects.all().delete()
        TicketRedirect.objects.all().delete()
        TicketAttachment.objects.all().delete()
        AIResponse.objects.all().delete()
        Ticket.objects.all().delete()

        self.stdout.write(self.style.SUCCESS("All tickets and related data deleted."))

    def unseed_notifications(self):
        """Delete all notifications."""
        self.stdout.write("Removing notifications...")
        Notification.objects.all().delete()
        self.stdout.write(self.style.SUCCESS("All notifications deleted."))

    def unseed_officers(self):
        """Delete all officers separately before removing users."""
        self.stdout.write("Removing officers...")
        Officer.objects.all().delete()
        self.stdout.write(self.style.SUCCESS("All officers deleted."))

    def unseed_users(self):
        """Delete all users (students, officers, admins)."""
        self.stdout.write("Removing users...")
        User.objects.all().delete()
        self.stdout.write(self.style.SUCCESS("All users deleted."))

    def unseed_departments(self):
        """Delete all departments after users are removed."""
        self.stdout.write("Removing departments...")
        Department.objects.all().delete()
        self.stdout.write(self.style.SUCCESS("All departments deleted."))
