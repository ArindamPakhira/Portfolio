'use client'

import { useState } from 'react'
import { profile } from '../../data/profile'
import Reveal from '../../components/Reveal/Reveal'
import SplitText from '../../components/SplitText/SplitText'
import MagneticButton from '../../components/MagneticButton/MagneticButton'
import { GithubIcon, LinkedinIcon, MailIcon } from '../../components/Icons'
import './Contact.css'

const phrases = ['Let’s build something', 'Say hello', 'Open to opportunities']

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [copied, setCopied] = useState(false)
  const [sent, setSent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }

  // Uses Web3Forms API to send the email securely
  const submit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          // PASTE YOUR API KEY HERE:
          access_key: "f76e0c20-773b-47e0-ad49-fc4352ecd779",
          name: form.name,
          email: form.email,
          message: form.message,
          subject: `New Portfolio Message from ${form.name}`,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSent(true)
        setForm({ name: '', email: '', message: '' }) // Clear the form
        setTimeout(() => setSent(false), 4000)
      }
    } catch (error) {
      console.error("Error sending message:", error)
    }
    
    setIsSubmitting(false)
  }

  const track = (
    <div className="marquee-track" style={{ '--speed': '38s' }}>
      {[...phrases, ...phrases].map((t, i) => (
        <span key={i} className="cmq-item">
          {t}
          <i className="cmq-dot" />
        </span>
      ))}
    </div>
  )

  return (
    <section id="contact" className="section contact">
      <div className="container">
        <div className="section-head">
          <h2>
            <SplitText text="Have a project in mind? Let’s talk." accentFrom={5} />
          </h2>
          <Reveal as="p">I am open to full-time roles, freelance work and interesting collaborations. I usually reply within a day.</Reveal>
        </div>

        <div className="contact-grid">
          <Reveal variant="left" className="contact-side">
            <button type="button" className="email-copy" onClick={copyEmail} data-cursor="Copy">
              <MailIcon />
              <span>{copied ? 'Email copied to clipboard' : profile.email}</span>
            </button>
            <p className="contact-note">Click the address to copy it, or use the form to send me a direct message.</p>
            
            <div className="socials">
              <MagneticButton href={profile.socials.github} variant="ghost" target="_blank" rel="noreferrer" strength={0.25}>
                <GithubIcon /> GitHub
              </MagneticButton>
              <MagneticButton href={profile.socials.linkedin} variant="ghost" target="_blank" rel="noreferrer" strength={0.25}>
                <LinkedinIcon /> LinkedIn
              </MagneticButton>
            </div>

            {/* NEW RESUME BUTTON */}
            <div style={{ marginTop: '1rem' }}>
              <MagneticButton href="/resume.pdf" target="_blank" rel="noreferrer" strength={0.2}>
                View My Resume
              </MagneticButton>
            </div>

          </Reveal>

          <Reveal variant="right">
            <form className="form" onSubmit={submit}>
              <div className="field">
                <input id="c-name" name="name" required placeholder=" " value={form.name} onChange={update} autoComplete="name" />
                <label htmlFor="c-name">Your name</label>
              </div>
              <div className="field">
                <input id="c-email" name="email" type="email" required placeholder=" " value={form.email} onChange={update} autoComplete="email" />
                <label htmlFor="c-email">Your email</label>
              </div>
              <div className="field">
                <textarea id="c-msg" name="message" required rows={5} placeholder=" " value={form.message} onChange={update} />
                <label htmlFor="c-msg">Your message</label>
              </div>
              <MagneticButton type="submit" strength={0.2} disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : sent ? 'Message sent successfully!' : 'Send message'}
              </MagneticButton>
            </form>
          </Reveal>
        </div>
      </div>

      {/* <div className="contact-marquee marquee" aria-hidden="true">
        {track}
        {track}
      </div> */}

      <footer className="footer">
        <div className="container footer-inner">
          {/* <span>© {new Date().getFullYear()} {profile.name}.</span> */}
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Back to top
          </button>
        </div>
      </footer>
    </section>
  )
}