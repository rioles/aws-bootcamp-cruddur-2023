import './SignupPage.css';
import React from "react";
import { ReactComponent as Logo } from '../components/svg/logo.svg';
import { Link } from "react-router-dom";

// ✅ Importations modernes (Amplify v6)
import { signUp } from 'aws-amplify/auth';

export default function SignupPage() {
  // Champs du formulaire
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  // Gestion des erreurs
  const [errors, setErrors] = React.useState('');
  const [cognitoErrors, setCognitoErrors] = React.useState('');

  // ✅ Fonction d’inscription
  const onsubmit = async (event) => {
    event.preventDefault();
    setErrors('');
    setCognitoErrors('');

    try {
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username: email, // email utilisé comme identifiant
        password,
        options: {
          userAttributes: {
            name,
            email,
            preferred_username: username,
          },
          autoSignIn: true, // optionnel : connexion automatique après confirmation
        },
      });

      console.log("✅ Sign-up success:", { isSignUpComplete, userId, nextStep });

      // Rediriger vers la page de confirmation
      window.location.href = `/confirm?email=${email}`;
    } catch (error) {
      console.error("❌ Sign-up error:", error);
      setErrors(error.message || "An error occurred during sign up.");
    }

    return false;
  };

  // ✅ Gestion des champs
  const name_onchange = (e) => setName(e.target.value);
  const email_onchange = (e) => setEmail(e.target.value);
  const username_onchange = (e) => setUsername(e.target.value);
  const password_onchange = (e) => setPassword(e.target.value);

  return (
    <article className='signup-article'>
      <div className='signup-info'>
        <Logo className='logo' />
      </div>

      <div className='signup-wrapper'>
        <form className='signup_form' onSubmit={onsubmit}>
          <h2>Sign up to create a Cruddur account</h2>

          <div className='fields'>
            <div className='field text_field name'>
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={name_onchange}
                required
              />
            </div>

            <div className='field text_field email'>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={email_onchange}
                required
              />
            </div>

            <div className='field text_field username'>
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={username_onchange}
                required
              />
            </div>

            <div className='field text_field password'>
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={password_onchange}
                required
              />
            </div>
          </div>

          {/* Affichage des erreurs */}
          {(errors || cognitoErrors) && (
            <div className='errors'>{errors || cognitoErrors}</div>
          )}

          <div className='submit'>
            <button type='submit'>Sign Up</button>
          </div>
        </form>

        <div className="already-have-an-account">
          <span>Already have an account?</span>
          <Link to="/signin">Sign in!</Link>
        </div>
      </div>
    </article>
  );
}
