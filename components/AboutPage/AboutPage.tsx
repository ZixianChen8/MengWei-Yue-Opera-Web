'use client'

import { useState } from 'react'
import { aboutPage } from '@/content/home'
import styles from './AboutPage.module.css'

const { bio, contact } = aboutPage

export default function AboutPage() {
  const [isSent, setIsSent] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSent(true)
  }

  return (
    <>
      {/* BIO */}
      <section className={styles.bio}>
        <div className={styles.bioInner}>
          <div className={styles.bioRail}>
            <div className={styles.railMeta} aria-hidden="true" />
            <div className={styles.bioVert}>
              {bio.vertZh.before}
              <span className={styles.red}>{bio.vertZh.red}</span>
              {bio.vertZh.after}
            </div>
          </div>
          <div className={styles.bioCol}>
            <div className={styles.eyebrow}>
              <span className={styles.dash} />
              <span>{bio.eyebrow}</span>
            </div>
            <h2 className={styles.bioHeading}>
              {bio.heading.zh}
              <small>{bio.heading.en}</small>
            </h2>
            <div className={styles.bioBody}>
              {bio.paragraphs.map((p, i) => (
                <p key={i}>
                  {p.zh}
                  <span className={styles.bioBodyEn}>{p.en}</span>
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className={styles.contact}>
        <div className={styles.contactInner}>
          <div className={styles.contactInfo}>
            <div className={styles.eyebrow}>
              <span className={styles.dash} />
              <span>{contact.eyebrow}</span>
            </div>
            <h2 className={styles.contactHeading}>
              {contact.heading.zh1}<br />{contact.heading.zh2}
              <small>{contact.heading.en}</small>
            </h2>
            <p className={styles.lede}>
              {contact.lede.zh}
              <span className={styles.ledeEn}>{contact.lede.en}</span>
            </p>
            <div className={styles.channels}>
              {contact.channels.map((ch, i) => (
                <div key={i} className={styles.ch}>
                  <div className={styles.chLbl}>{ch.zh}</div>
                  <div className={styles.chVal}>
                    {ch.val}
                    <span className={styles.chSub}>{ch.sub}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form
            className={`${styles.formWrap}${isSent ? ` ${styles.isSent}` : ''}`}
            onSubmit={handleSubmit}
            noValidate
          >
            <div className={styles.sealOrnament}>{contact.form.sealGlyph}</div>
            <p className={styles.formIntro}>{contact.form.intro}</p>

            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="ap-name">
                  <span className={styles.fieldCn}>
                    {contact.form.fields.name.zh}<span className={styles.req}>·</span>
                  </span>
                  <span className={styles.fieldEn}>{contact.form.fields.name.en}</span>
                </label>
                <input
                  id="ap-name" name="name" type="text"
                  placeholder={contact.form.fields.name.ph}
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="ap-email">
                  <span className={styles.fieldCn}>
                    {contact.form.fields.email.zh}<span className={styles.req}>·</span>
                  </span>
                  <span className={styles.fieldEn}>{contact.form.fields.email.en}</span>
                </label>
                <input
                  id="ap-email" name="email" type="email"
                  placeholder={contact.form.fields.email.ph}
                  required
                />
              </div>
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="ap-subject">
                  <span className={styles.fieldCn}>{contact.form.fields.subject.zh}</span>
                  <span className={styles.fieldEn}>{contact.form.fields.subject.en}</span>
                </label>
                <select id="ap-subject" name="subject">
                  {contact.form.subjects.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="ap-phone">
                  <span className={styles.fieldCn}>{contact.form.fields.phone.zh}</span>
                  <span className={styles.fieldEn}>{contact.form.fields.phone.en}</span>
                </label>
                <input
                  id="ap-phone" name="phone" type="tel"
                  placeholder={contact.form.fields.phone.ph}
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="ap-msg">
                <span className={styles.fieldCn}>
                  {contact.form.fields.message.zh}<span className={styles.req}>·</span>
                </span>
                <span className={styles.fieldEn}>{contact.form.fields.message.en}</span>
              </label>
              <textarea
                id="ap-msg" name="message" rows={5}
                placeholder={contact.form.fields.message.ph}
                required
              />
            </div>

            <div className={styles.formActions}>
              <label className={styles.privacy}>
                <input type="checkbox" required className={styles.privacyCheck} />
                <span>{contact.form.privacy}</span>
              </label>
              <button className={styles.submitBtn} type="submit">
                <span>{contact.form.submit.zh}</span>
                <span className={styles.submitEn}>{contact.form.submit.en}</span>
                <span className={styles.submitArrow}>→</span>
              </button>
            </div>

            <div className={styles.sentMsg}>
              <span className={styles.stamp}>{contact.form.sent.stamp}</span>
              {contact.form.sent.zh}
              <span className={styles.sentEn}>{contact.form.sent.en}</span>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}
