import './ProfileInfo.css';
import { ReactComponent as ElipsesIcon } from './svg/elipses.svg';
import React from "react";

// ✅ Import modular Auth API
import { signOut } from 'aws-amplify/auth';

export default function ProfileInfo(props) {
  const [popped, setPopped] = React.useState(false);

  const clickPop = () => {
    setPopped(!popped);
  };

  const handleSignOut = async () => {
    try {
      // ✅ Sign out the user globally
      await signOut({ global: true });
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const getClasses = () => {
    let classes = ["profile-info-wrapper"];
    if (popped === true) {
      classes.push("popped");
    }
    return classes.join(" ");
  };

  return (
    <div className={getClasses()}>
      <div className="profile-dialog">
        <button onClick={handleSignOut}>Sign Out</button>
      </div>

      <div className="profile-info" onClick={clickPop}>
        <div className="profile-avatar"></div>
        <div className="profile-desc">
          <div className="profile-display-name">
            {props.user?.display_name || "My Name"}
          </div>
          <div className="profile-username">
            @{props.user?.handle || "handle"}
          </div>
        </div>
        <ElipsesIcon className="icon" />
      </div>
    </div>
  );
}

