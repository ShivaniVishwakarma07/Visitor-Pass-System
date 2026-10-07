const sendEmail = require("../utils/sendEmail");

const sendAppointmentNotification = async (req, res) => {
  try {
    const { email, visitorName, appointmentDate, status } = req.body;

    if (!email || !visitorName || !appointmentDate || !status) {
      return res.status(400).json({
        message:
          "Email, visitor name, appointment date and status are required",
      });
    }

    await sendEmail({
      to: email,
      subject: `Appointment ${status}`,
      text: `Hello ${visitorName},

Your visitor appointment has been ${status}.

Appointment Date: ${new Date(appointmentDate).toLocaleString()}

Please contact the frontdesk if you have any questions.

Visitor Pass Management System`,
      html: `
        <h2>Visitor Appointment Update</h2>
        <p>Hello ${visitorName},</p>
        <p>Your visitor appointment has been <strong>${status}</strong>.</p>
        <p><strong>Appointment Date:</strong> ${new Date(
          appointmentDate,
        ).toLocaleString()}</p>
        <p>Please contact the frontdesk if you have any questions.</p>
        <p>Visitor Pass Management System</p>
      `,
    });

    res.json({
      message: "Appointment notification sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to send email notification",
      error: error.message,
    });
  }
};

module.exports = {
  sendAppointmentNotification,
};
