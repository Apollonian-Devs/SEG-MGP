from django.contrib.auth.models import User
from api.models import Ticket, Notification
import yagmail

def create_notification(to_user, ticket, msg):
    """
    Creates a new notification for a user about a ticket.

    @param to_user: User to receive the notification
    @param ticket: Related ticket object
    @param msg: Notification message content
    """
    Notification.objects.create(
        user_profile=to_user,
        ticket=ticket,
        message=msg,
    )
    
def get_notifications(user, limit=10):
    """
    Retrieve unread notifications for a user.

    @param user: User whose notifications to retrieve
    @param limit: Maximum number of notifications to return (default 10)
    @return: QuerySet of unread notifications ordered by creation date
    """
    return Notification.objects.filter(
        user_profile=user,
        read_status=False
    ).order_by("-created_at")[:limit]

def mark_id_as_read(target):
    """
    Marks a single notification as read.

    @param target: ID of the notification to mark as read
    """
    result = Notification.objects.filter(id=target).first()
    if result: 
        result.read_status = True
        result.save()

def mark_all_notifications_as_read(user):
    """
    Marks all unread notifications for a user as read.

    @param user: User whose notifications to mark as read
    """
    Notification.objects.filter(user_profile=user, read_status=False).update(
        read_status=True,
    )

def send_email(recepient_user, subject, body):
    """
    Sends an email to a user.

    @param recepient_user: User to receive the email
    @param subject: Email subject
    @param body: Email content
    """
    try:
        yag = yagmail.SMTP('no.reply.testTicketApp@gmail.com', 'jvls lbft kkpr uazn')
        yag.send(
            to=recepient_user.email,
            subject=subject,
            contents=body
        )
    except:
        print("email not sent")

def notify_user_of_change_to_ticket(message, to_user, ticket, email_subject):
    """
    Creates a notification and sends email about ticket changes.

    @param message: Notification/email content
    @param to_user: Recipient user
    @param ticket: Related ticket object
    @param email_subject: Subject line for email
    """
    create_notification(to_user, ticket, message)
    send_email(to_user, email_subject, message)