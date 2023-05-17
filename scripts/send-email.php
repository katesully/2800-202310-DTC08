<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the recipient and content from the POST data
    $recipient = $_POST['recipient'];
    $content = $_POST['content'];

    // Send the email using the mail() function
    $subject = 'Your Subject Here';
    $headers = "From: your-email@example.com\r\n";
    $headers .= "Reply-To: your-email@example.com\r\n";
    $headers .= "Content-Type: text/html\r\n";
    $message = $content;

    if (mail($recipient, $subject, $message, $headers)) {
        // Email sent successfully
        echo "Email sent!";
    } else {
        // Error sending email
        echo "Error sending email.";
    }
}
?>
