import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import LockedChest from "./LockedChest";
import UnlockModal from "./UnlockModal";
import ChestAnimation from "./ChestAnimation";
import RewardReveal from "./RewardReveal";

// State machine for the mystery box flow
const STATES = {
  LOCKED: "locked",
  MODAL_OPEN: "modal_open",
  ANIMATING: "animating",
  REVEALED: "revealed",
  ALREADY_UNLOCKED: "already_unlocked"
};

export default function MysteryBox() {
  const [searchParams] = useSearchParams();
  const [currentState, setCurrentState] = useState(STATES.LOCKED);
  const [userData, setUserData] = useState(null);

  // Check localStorage for existing unlock
  useEffect(() => {
    const stored = localStorage.getItem('gymgraph_mystery_box');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setUserData(data);
        setCurrentState(STATES.ALREADY_UNLOCKED);
      } catch (e) {
        localStorage.removeItem('gymgraph_mystery_box');
      }
    }
  }, []);

  // Get referral code from URL
  const referralCode = searchParams.get('ref');

  const handleChestClick = () => {
    if (currentState === STATES.LOCKED) {
      setCurrentState(STATES.MODAL_OPEN);
    }
  };

  const handleModalClose = () => {
    setCurrentState(STATES.LOCKED);
  };

  const handleSignupSuccess = (data) => {
    setUserData(data);
    // Store in localStorage
    localStorage.setItem('gymgraph_mystery_box', JSON.stringify({
      email: data.email || '',
      referral_code: data.referral_code,
      reward_type: data.reward_type,
      reward_coins: data.reward_coins,
      premium_days: data.premium_days,
      position: data.position,
      is_lucky: data.is_lucky,
      timestamp: new Date().toISOString()
    }));
    // Trigger animation
    setCurrentState(STATES.ANIMATING);
  };

  const handleAnimationComplete = () => {
    setCurrentState(STATES.REVEALED);
  };

  const handleRevealClose = () => {
    setCurrentState(STATES.ALREADY_UNLOCKED);
  };

  return (
    <>
      {/* Locked chest display on landing page */}
      <LockedChest
        onClick={handleChestClick}
        isUnlocked={currentState === STATES.ALREADY_UNLOCKED}
        userData={userData}
      />

      {/* Signup modal */}
      <UnlockModal
        open={currentState === STATES.MODAL_OPEN}
        onClose={handleModalClose}
        onSuccess={handleSignupSuccess}
        referralCode={referralCode}
      />

      {/* Full-screen chest opening animation */}
      {currentState === STATES.ANIMATING && (
        <ChestAnimation onComplete={handleAnimationComplete} />
      )}

      {/* Reward reveal with sharing */}
      <RewardReveal
        open={currentState === STATES.REVEALED}
        onClose={handleRevealClose}
        userData={userData}
      />
    </>
  );
}
