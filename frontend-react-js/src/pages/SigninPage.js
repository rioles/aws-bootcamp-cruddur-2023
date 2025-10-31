import './SigninPage.css';
import React from "react";
import { ReactComponent as Logo } from '../components/svg/logo.svg';
import { Link } from "react-router-dom";

// ✅ Import Amplify v6 (authentification + récupération de session)
import { signIn, fetchAuthSession } from 'aws-amplify/auth';

export default function SigninPage() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errors, setErrors] = React.useState('');
  const [cognitoErrors, setCognitoErrors] = React.useState('');

  // ✅ Gestion du formulaire de connexion
  const onSubmit = async (event) => {
    event.preventDefault();
    setErrors('');
    setCognitoErrors('');

    console.log(`[AUTH] Tentative de connexion pour l'utilisateur: ${email}`);

    try {
      const { nextStep, isSignedIn } = await signIn({
        username: email,
        password,
      });

      console.log("[AUTH] Réponse de Cognito reçue. nextStep:", nextStep, "isSignedIn:", isSignedIn);

      if (isSignedIn) {
        console.log("✅ [AUTH] Succès: L'utilisateur est connecté. Récupération des jetons...");

        // ✅ Récupère la session active pour obtenir les jetons
        const session = await fetchAuthSession();

        const accessToken = session.tokens?.accessToken?.toString();
        const idToken = session.tokens?.idToken?.toString();
        const refreshToken = session.tokens?.refreshToken?.toString();

        if (accessToken) {
          // ✅ Sauvegarde du jeton d'accès dans le stockage local
          localStorage.setItem("access_token", accessToken);
          console.log("🔑 [AUTH] Access token stocké avec succès.", accessToken);
        } else {
          console.warn("⚠️ [AUTH] Aucun access token trouvé dans la session.");
        }

        console.log("🪪 [AUTH] ID Token:", idToken);
        console.log("🔁 [AUTH] Refresh Token:", refreshToken);

        console.log("➡️ [AUTH] Redirection vers la page d'accueil (/).");
        window.location.href = "/";

      } else if (nextStep?.signInStep === "CONFIRM_SIGN_UP") {
        console.warn("⚠️ [AUTH] Étape suivante: CONFIRM_SIGN_UP. Redirection vers /confirm.");
        window.location.href = "/confirm";
      } else if (nextStep?.signInStep === "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED") {
        console.warn("⚠️ [AUTH] L'utilisateur doit définir un nouveau mot de passe.");
        setCognitoErrors("Veuillez définir un nouveau mot de passe avant de continuer.");
      } else {
        console.log("[AUTH] Étape suivante non gérée:", nextStep?.signInStep);
        setCognitoErrors(`Veuillez compléter l'étape : ${nextStep?.signInStep}`);
      }

    } catch (error) {
      console.error("❌ [AUTH] Erreur lors de l'appel signIn:", error);

      if (error.name === "UserNotConfirmedException") {
        console.warn("⚠️ [AUTH] Utilisateur non confirmé. Redirection vers /confirm.");
        window.location.href = "/confirm";
      } else {
        setCognitoErrors(error.message || "La connexion a échoué.");
      }
    }

    return false;
  };

  // ✅ Gestion des champs
  const emailOnChange = (event) => setEmail(event.target.value);
  const passwordOnChange = (event) => setPassword(event.target.value);

  const renderErrors = () => {
    if (errors || cognitoErrors) {
      return <div className='errors'>{errors || cognitoErrors}</div>;
    }
    return null;
  };

  // ✅ Rendu du composant
  return (
    <article className="signin-article">
      <div className='signin-info'>
        <Logo className='logo' />
      </div>

      <div className='signin-wrapper'>
        <form className='signin_form' onSubmit={onSubmit}>
          <h2>Sign into your Cruddur account</h2>

          <div className='fields'>
            <div className='field text_field username'>
              <label>Email</label>
              <input
                type="text"
                value={email}
                onChange={emailOnChange}
                required
              />
            </div>

            <div className='field text_field password'>
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={passwordOnChange}
                required
              />
            </div>
          </div>

          {renderErrors()}

          <div className='submit'>
            <Link to="/forgot" className="forgot-link">Forgot Password?</Link>
            <button type='submit'>Sign In</button>
          </div>
        </form>

        <div className="dont-have-an-account">
          <span>Don't have an account?</span>
          <Link to="/signup">Sign up!</Link>
        </div>
      </div>
    </article>
  );
}
