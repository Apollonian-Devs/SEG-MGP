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
    """Build automation command to unseed the database."""

    help = "Unseeds the database by removing seeded data."

    def handle(self, *args, **options):
        """Unseed the database."""
        self.stdout.write(self.style.NOTICE("Unseeding the database..."))
        self.unseed_tickets()
        self.unseed_users()
        self.unseed_departments()

        self.stdout.write(self.style.SUCCESS("Database unseeding complete!"))


    def unseed_tickets(self):
        """Delete all tickets."""
        self.stdout.write("Removing tickets...")
        count, _ = Ticket.objects.all().delete()
        self.stdout.write(f"Deleted {count} tickets.")

    
    def unseed_users(self):
        """Delete all seeded users including superusers and staff."""
        self.stdout.write("Removing users...")
        
        user_count = User.objects.count()  # Count all users
        User.objects.all().delete()  # Delete all users
        
        officer_count = Officer.objects.count()
        Officer.objects.all().delete()

        self.stdout.write(f"Deleted {user_count} users and {officer_count} officers.")


    def unseed_departments(self):
        """Delete all departments."""
        self.stdout.write("Removing departments...")
        count, _ = Department.objects.all().delete()
        self.stdout.write(f"Deleted {count} departments.")