<?php
header('Content-Type: application/json; charset=utf-8');

// ==========================================================================
// CONFIGURATION DE L'ENVOI D'EMAIL
// ==========================================================================
$to_email = 'oenocapucins@gmail.com'; // REMPLACEZ PAR VOTRE ADRESSE DE RÉCEPTION SI NÉCESSAIRE
$subject_prefix = '[Club Oenologie Angers] ';

// Adresse email d'expédition (doit appartenir à votre domaine d'hébergement, ex: contact@votre-domaine.com)
// Cela permet d'éviter que l'email soit bloqué ou classé comme spam (usurpation d'identité).
$from_email = 'no-reply@oenologie-angers.com'; 

// ==========================================================================
// SÉCURITÉ ET TRAITEMENT
// ==========================================================================

// Autoriser uniquement les requêtes POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Méthode non autorisée.']);
    exit;
}

// 1. Solution Anti-Spam : HONEYPOT (le champ caché "website" doit impérativement être vide)
if (!empty($_POST['website'])) {
    // On simule une réussite pour ne pas donner d'indice au bot spammeur
    echo json_encode(['status' => 'success', 'message' => 'Message envoyé avec succès (simulation).']);
    exit;
}

// 2. Vérification du consentement RGPD
if (!isset($_POST['rgpd_consent'])) {
    echo json_encode(['status' => 'error', 'message' => 'Vous devez accepter la politique de confidentialité / RGPD pour envoyer le message.']);
    exit;
}

// 3. Récupération et nettoyage des données (XSS Protection)
$name = isset($_POST['name']) ? strip_tags(trim($_POST['name'])) : '';
$email = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_VALIDATE_EMAIL) : '';
$subject = isset($_POST['subject']) ? strip_tags(trim($_POST['subject'])) : '';
$comments = isset($_POST['comments']) ? strip_tags(trim($_POST['comments'])) : '';

// 4. Validation des données
if (empty($name) || empty($email) || empty($subject) || empty($comments)) {
    echo json_encode(['status' => 'error', 'message' => 'Veuillez remplir tous les champs obligatoires du formulaire.']);
    exit;
}

if (!$email) {
    echo json_encode(['status' => 'error', 'message' => 'L\'adresse email saisie est invalide.']);
    exit;
}

// 5. En-têtes de l'email
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: Club Oenologie Angers <" . $from_email . ">\r\n";
$headers .= "Reply-To: " . $name . " <" . $email . ">\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// 6. Contenu de l'email (Format HTML)
$email_subject = $subject_prefix . $subject;
$email_body = "
<html>
<head>
    <title>Nouveau message de contact</title>
</head>
<body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #fcfbf9; padding: 20px;'>
    <div style='max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e8decb; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);'>
        <div style='background-color: #5c0612; color: #ffffff; padding: 20px; text-align: center;'>
            <h1 style='margin: 0; font-size: 20px;'>Nouveau message de contact</h1>
            <p style='margin: 5px 0 0 0; font-size: 14px;'>Club Œnologie d'Angers</p>
        </div>
        <div style='padding: 25px;'>
            <p><strong>Nom de l'expéditeur :</strong> " . htmlspecialchars($name) . "</p>
            <p><strong>Email :</strong> <a href='mailto:" . htmlspecialchars($email) . "' style='color: #cca762; text-decoration: none;'>" . htmlspecialchars($email) . "</a></p>
            <p><strong>Sujet :</strong> " . htmlspecialchars($subject) . "</p>
            <hr style='border: 0; border-top: 1px solid #e8decb; margin: 20px 0;'>
            <p><strong>Message :</strong></p>
            <div style='background-color: #fdfaf4; padding: 15px; border-left: 4px solid #5c0612; font-style: italic; white-space: pre-line; border-radius: 0 4px 4px 0;'>
" . htmlspecialchars($comments) . "
            </div>
        </div>
        <div style='background-color: #f5eedf; text-align: center; padding: 15px; font-size: 11px; color: #6b5626;'>
            Ce message a été généré automatiquement par le formulaire de contact du site.
        </div>
    </div>
</body>
</html>
";

// 7. Envoi de l'email
if (mail($to_email, $email_subject, $email_body, $headers)) {
    echo json_encode(['status' => 'success', 'message' => 'Votre message a bien été envoyé.']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Erreur technique lors de l\'envoi du mail (fonction PHP mail en panne). Veuillez nous contacter par email directement.']);
}
?>
