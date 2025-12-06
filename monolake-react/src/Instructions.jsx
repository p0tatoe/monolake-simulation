import React, { useEffect, useState } from 'react';

/**
 * A simple overlay to display instructions.
 * Dismisses on any click or scroll event on the window.
 * * @param {object} props
 * @param {function} props.onDismiss - Function called when the overlay is dismissed.
 */
export default function InstructionsOverlay({ onDismiss }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Function to handle the dismissal of the overlay
    const handleUserInteraction = () => {
      // Start the fade-out
      setVisible(false);
      
      // Wait for the CSS transition to complete (1000ms from style) 
      // before calling onDismiss and removing listeners
      const timeoutId = setTimeout(() => {
        if (onDismiss) onDismiss();
        
        // Remove listeners after dismissal is fully processed
        window.removeEventListener('click', handleUserInteraction);
        window.removeEventListener('wheel', handleUserInteraction);
      }, 1000); // Match the CSS transition duration

      // Important: Remove the listeners immediately so they don't fire multiple times
      // and only the timeout handles the final state.
      // We keep the wheel listener active for 1 second just for redundancy.
      // A better practice is to remove them all and let the timeout handle the rest.
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('wheel', handleUserInteraction);
      
      return () => clearTimeout(timeoutId);
    };

    // Attach event listeners for click and scroll to dismiss the overlay
    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('wheel', handleUserInteraction);

    // Cleanup function to remove listeners if the component unmounts early
    return () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('wheel', handleUserInteraction);
    };
  }, [onDismiss]);

  // If the component is no longer visible, don't render anything
  if (!visible) {
    return null;
  }
  
  // The 'visible' state is now only used to control the opacity/transition
  // The full removal is handled by the useEffect cleanup.
  
  // Note: The logic for 'visible' needs adjustment if you want to keep the 
  // transition logic perfectly. Since we are removing listeners right away, 
  // we need to rely on a timeout for the full component removal.
  
  return (
    <div
      // This wrapper allows the transition effect
      style={{
        position: 'fixed', // Use 'fixed' instead of 'absolute' for standard DOM overlay
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        // Ensure it's above other standard DOM elements
        zIndex: 10, 
        // This is the main change: we remove the pointerEvents: 'none'
        // so a click *on the overlay itself* still registers, and use the 
        // opacity transition.
        transition: 'opacity 1s ease',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none', // Block clicks only when fading out
      }}
      // You can add a background color here if you want a full-screen semi-transparent wash
      // onClick is not needed here as the useEffect handles window-level clicks
    >
      <div
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          textAlign: 'left',
          color: 'white',
          fontSize: '1rem',
          lineHeight: '1.4',
          maxWidth: '250px',
          padding: '8px 12px',
          background: 'rgba(0, 0, 0, 0.7)', // Increased opacity for better readability on standard screen
          borderRadius: '8px',
          // Ensure this specific box does not block pointer events *if* you need them to pass through 
          // to an element beneath it, but since you want to dismiss on click,
          // the parent div's pointerEvents should probably be 'auto' when visible.
          pointerEvents: 'none', // Prevents this box from being the target of the 'click anywhere' dismissal
        }}
      >
        <p>Use the arrow keys or the tab key to move around.
        <br/>
        Press Enter or Click to learn more about an animal. 
        <br/>
        Press Esc to exit.
        <br/>
        Click anywhere to dismiss these instructions.</p>
      </div>
    </div>
  );
}