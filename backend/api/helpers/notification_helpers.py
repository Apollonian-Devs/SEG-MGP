from django.contrib.auth.models import User
from api.models import Ticket, Notification
import yagmail




def create_notification(to_user, ticket, msg):
    Notification.objects.create(
    user_profile=to_user,
    ticket=ticket,
    message=msg,
    )
    

def get_notifications(user, limit=10):
    """
    Retrieve 'limit' number of unread latest notifications for the user.
    """
    return Notification.objects.filter(
        user_profile=user,
        read_status=False
    ).order_by("-created_at")[:limit]


def mark_id_as_read(target):
    """
    Mark notification of id as read.
    """
    result = Notification.objects.filter(id=target).first()
    if result: 
        result.read_status = True
        result.save()


def mark_all_notifications_as_read(user):
    """
    Mark all unread notifications for the user as read 
    """
    Notification.objects.filter(user_profile=user, read_status=False).update(
        read_status=True,
    )

def send_email(recepient_user, subject, body):

    try:
        yag = yagmail.SMTP('no.reply.testTicketApp@gmail.com', 'jvls lbft kkpr uazn')

        # Send the email
        yag.send(
            to=recepient_user.email,
            subject=subject,
            contents=body
        )

        print("Email sent successfully!")
    except:
        print("email not sent")

def notify_user_of_change_to_ticket(message, to_user, ticket, email_subject):
    create_notification(to_user, ticket, message)
    send_email(to_user, email_subject, message)