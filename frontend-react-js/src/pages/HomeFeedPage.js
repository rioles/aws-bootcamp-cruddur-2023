import './HomeFeedPage.css';
import React from "react";
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';

import DesktopNavigation from '../components/DesktopNavigation';
import DesktopSidebar from '../components/DesktopSidebar';
import ActivityFeed from '../components/ActivityFeed';
import ActivityForm from '../components/ActivityForm';
import ReplyForm from '../components/ReplyForm';

export default function HomeFeedPage() {
  const [activities, setActivities] = React.useState([]);
  const [popped, setPopped] = React.useState(false);
  const [poppedReply, setPoppedReply] = React.useState(false);
  const [replyActivity, setReplyActivity] = React.useState({});
  const [user, setUser] = React.useState(null);
  const dataFetchedRef = React.useRef(false);

  // ✅ Load feed data
  const loadData = async () => {
    try {
      const backend_url = `${process.env.REACT_APP_BACKEND_URL}/api/activities/home`;
      const res = await fetch(backend_url, { method: "GET" });
      const resJson = await res.json();
      if (res.status === 200) {
        setActivities(resJson);
      } else {
        console.log("Error fetching activities:", res);
      }
    } catch (err) {
      console.error("Load data error:", err);
    }
  };

  // ✅ Check if user is authenticated (Amplify v6 compatible)
  const checkAuth = async () => {
    try {
      // Get the current authenticated user
      const { username, userId, signInDetails } = await getCurrentUser();

      // Optionally fetch tokens or user attributes
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken;

      // You can extract attributes from the token payload if needed
      const attributes = idToken?.payload || {};
      const newUser = {
      display_name: attributes.name || username || "Anonymous",
      handle: attributes.preferred_username || username || "user",
    };

      setUser(newUser);
      
      console.log("✅ Authenticated user:", newUser);
    } catch (err) {
      // User is not signed in
      console.warn("No authenticated user found:", err);
      setUser(null);
    }
  };

  // ✅ Prevent double-fetch
  React.useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    loadData();
    checkAuth();
  }, []);

  return (
    <article>
      <DesktopNavigation user={user} active={'home'} setPopped={setPopped} />
      <div className='content'>
        <ActivityForm
          popped={popped}
          setPopped={setPopped}
          setActivities={setActivities}
        />
        <ReplyForm
          activity={replyActivity}
          popped={poppedReply}
          setPopped={setPoppedReply}
          setActivities={setActivities}
          activities={activities}
        />
        <ActivityFeed
          title="Home"
          setReplyActivity={setReplyActivity}
          setPopped={setPoppedReply}
          activities={activities}
        />
      </div>
      <DesktopSidebar user={user} />
    </article>
  );
}
