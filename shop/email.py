from templated_mail.mail import BaseEmailMessage


class Ordered (BaseEmailMessage):
    template_name = "email/ordered.html"

    def get_context_data(self):
        context = super().get_context_data()
        return context
