import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Turnstile } from "@marsidev/react-turnstile";
import "./ExpectationSettingScreen.css";
import { publicAsset } from "../utils/publicAsset";
import { submitExpectationFormResponse } from "../api/expectationForm";
import {
  AGREEMENT_SHELL_WELCOME_LEAD,
  COURSE_TYPES,
  EXPECTATION_AGREEMENT_EYEBROW,
  EXPECTATION_AGREEMENT_SECTION_SUBTITLE,
  EXPECTATION_AGREEMENT_SECTION_TITLE,
  EXPECTATION_AGREEMENT_V2_INTRODUCTION,
  SIGNATURE_REGEX,
} from "../expectationSetting/constants";
import { EXPECTATION_AGREEMENT_INFO } from "../expectationSetting/expectationAgreementInfo";
import { parseExpectationDetail } from "../expectationSetting/parseExpectationDetail";

const SKIP_TURNSTILE = import.meta.env.VITE_EXPECTATION_SKIP_CAPTCHA === "true";
const TURNSTILE_SITE_KEY = (import.meta.env.VITE_TURNSTILE_SITE_KEY ?? "").trim();

function SignatureModal({ open, initialName, onClose, onConfirm }) {
  const [name, setName] = useState(initialName || "");

  useEffect(() => {
    if (open) setName(initialName || "");
  }, [open, initialName]);

  if (!open) return null;

  const handleSubmit = () => {
    if (!name?.trim()) {
      window.alert("Please enter your signature!");
      return;
    }
    if (!SIGNATURE_REGEX.test(name.trim())) {
      window.alert("Invalid signature! Do not include numbers or special characters.");
      return;
    }
    onConfirm(name.trim());
  };

  return (
    <div className="es-modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="es-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="es-sig-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="es-modal__head" id="es-sig-modal-title">
          Your Signature
        </div>
        <div className="es-modal__input-row">
          <span className="ph ph-user" aria-hidden />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            autoComplete="name"
          />
        </div>
        <div className="es-modal__preview">{name || "\u00a0"}</div>
        <p className="es-modal__note">
          By selecting Adopt and Sign, I confirm that I have read and accept the &quot;Scaler Course
          Enrolment Agreement&quot; document.
        </p>
        <div className="es-modal__footer">
          <button
            type="button"
            className="es-modal__close"
            data-track-id="expectation_signature_modal_close"
            onClick={onClose}
          >
            CLOSE
          </button>
          <button
            type="button"
            className="es-modal__sign"
            data-track-id="expectation_signature_modal_adopt"
            onClick={handleSubmit}
          >
            ADOPT AND SIGN
          </button>
        </div>
      </div>
    </div>
  );
}

export function ExpectationSettingScreen({
  detail,
  user,
  slug,
  course,
  utmSource,
  onBack,
  onContinueToLetter,
}) {
  const parsed = parseExpectationDetail(detail);
  const queryClient = useQueryClient();
  const turnstileRef = useRef(null);

  const [signature, setSignature] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [localSubmitted, setLocalSubmitted] = useState(false);
  const [submitOverlay, setSubmitOverlay] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");

  const showTurnstile = !SKIP_TURNSTILE && Boolean(TURNSTILE_SITE_KEY);
  const turnstileMissing = !SKIP_TURNSTILE && !TURNSTILE_SITE_KEY;

  const agreementSections = parsed
    ? EXPECTATION_AGREEMENT_INFO[parsed.selectedCourseName] ||
      EXPECTATION_AGREEMENT_INFO[COURSE_TYPES.expectation_form_academy_v2]
    : null;
  const infoBlocks = agreementSections ? Object.keys(agreementSections) : [];

  const firstName = (() => {
    const n = user?.name || parsed?.user?.name || "";
    const parts = String(n).trim().split(/\s+/);
    return parts.length ? parts[0] : "User";
  })();

  const superBatchName = user?.super_batch_group_name
    ? `Scaler - ${user.super_batch_group_name}`
    : parsed?.user?.super_batch_group_name
      ? `Scaler - ${parsed.user.super_batch_group_name}`
      : "Scaler";

  const submitMutation = useMutation({
    mutationFn: async ({ recaptchaToken }) => {
      if (!parsed?.firstQuestionId) {
        throw new Error("Missing form question id from server.");
      }
      return submitExpectationFormResponse({
        formGroupLabel: parsed.formGroupLabel,
        slug,
        responses: { [parsed.firstQuestionId]: signature },
        utmSource,
        recaptchaToken,
      });
    },
    onMutate: () => {
      setSubmitOverlay(true);
    },
    onSuccess: async () => {
      setSubmitOverlay(false);
      setLocalSubmitted(true);
      await queryClient.invalidateQueries({ queryKey: ["expectation-form", slug, course] });
    },
    onError: () => {
      setSubmitOverlay(false);
      window.alert("Failed to save response. Try again after sometime!");
      if (!SKIP_TURNSTILE) {
        setTurnstileToken("");
        turnstileRef.current?.reset();
      }
    },
  });

  const handleSignOff = useCallback(() => {
    if (turnstileMissing) {
      window.alert(
        "Captcha missing! Please verify or refresh the page and try again.",
      );
      return;
    }
    if (SKIP_TURNSTILE) {
      submitMutation.mutate({ recaptchaToken: "" });
      return;
    }
    if (!turnstileToken) {
      window.alert("Captcha missing! Please verify or refresh the page and try again.");
      turnstileRef.current?.reset();
      return;
    }
    submitMutation.mutate({ recaptchaToken: turnstileToken });
  }, [submitMutation, turnstileMissing, turnstileToken]);

  const headerCourseTitle = parsed?.selectedCourseName || "Scaler Academy";
  const showFilledHeader = localSubmitted || parsed?.formFilled;
  const showUpdateBanner = parsed?.updatable && !localSubmitted && !parsed?.formFilled;
  const showAgreementNarrative = !localSubmitted && !parsed?.formFilled;

  if (!parsed) {
    return (
      <section className="screen default-screen es-expectation-screen">
        <div className="frame form-frame">
          <main className="content form-content">
            <p className="es-inline-error">Could not load enrolment agreement.</p>
          </main>
        </div>
      </section>
    );
  }

  return (
    <section className="screen default-screen es-expectation-screen">
      <div className="frame form-frame">
        <main className="content form-content">
          <header className="topbar">
            <div className="topbar-left">
              {typeof onBack === "function" ? (
                <button
                  type="button"
                  className="back-link"
                  data-track-id="expectation_header_back"
                  onClick={onBack}
                  aria-label="Go back"
                >
                  <i className="ph ph-arrow-left" aria-hidden />
                </button>
              ) : null}
              <div className="step-meta">
                <div className="step-overline">Final</div>
                <div className="step-title">Course enrollment agreement</div>
              </div>
            </div>
            <div className="progress" aria-hidden>
              <div className="progress-bar" style={{ "--progress": "100%" }}>
                <span />
              </div>
              <div className="progress-label">06 / 06</div>
            </div>
          </header>

          {showFilledHeader ? (
            <div className="es-filled-banner">
              <div className="es-filled-banner__h">Congratulations, {firstName}</div>
              <div className="es-filled-banner__sub">
                You&apos;ve successfully completed your enrolment. All the best in your up-skilling journey.
              </div>
            </div>
          ) : null}

          {showAgreementNarrative ? (
            <div className="narrative-head step-narrative-head">
              <p className="narrative-section-label">{EXPECTATION_AGREEMENT_EYEBROW}</p>
              <h2 className="section-title">{EXPECTATION_AGREEMENT_SECTION_TITLE}</h2>
              <p className="section-subtitle">{EXPECTATION_AGREEMENT_SECTION_SUBTITLE}</p>
            </div>
          ) : null}

          {showUpdateBanner ? (
            <div className="es-update-banner">
              <span className="es-update-banner__icon ph ph-warning-circle" aria-hidden />
              <div className="es-update-banner__text">
                This document is for &quot;{headerCourseTitle}&quot; program. In case you have enrolled to a
                different program, update it from your Scaler dashboard before signing.
              </div>
            </div>
          ) : null}

          <div className="agreement-shell">
            <div className="agreement-intro">
              <h3>Welcome to Scaler! {firstName}</h3>
              <p>{AGREEMENT_SHELL_WELCOME_LEAD}</p>
            </div>
            <div className="agreement-paper">
              <div className="agreement-certificate">
                <div className="agreement-certificate-inner">
                  <h3 className="agreement-cert-title">Scaler Course Enrolment Agreement</h3>
                  <div className="agreement-cert-meta">
                    <div className="agreement-brand-lockup">
                      <div className="agreement-brand-name">
                        <span>SCALER</span>
                        <img
                          className="agreement-brand-mark"
                          src={publicAsset("/assets/expectation/Union.png")}
                          alt=""
                        />
                      </div>
                      <div className="agreement-brand-sub">By InterviewBit</div>
                    </div>
                    <div className="agreement-seal">
                      <img
                        className="agreement-seal__mark"
                        src={publicAsset("/assets/expectation/Union.png")}
                        alt=""
                      />
                    </div>
                    <div className="agreement-company">
                      InterviewBit Software Services Pvt. Ltd.
                      <br />
                      Work Futura, Sr No 133 (P), CTS No 4944,
                      <br />
                      Magarpatta Road, Hadapsar, Pune,
                      <br />
                      Maharashtra - 411028.
                    </div>
                  </div>
                </div>
              </div>

              <div className="agreement-copy">
                <div className="agreement-watermark">S</div>
                <p>
                  Hi {firstName}, {EXPECTATION_AGREEMENT_V2_INTRODUCTION}
                </p>

                {infoBlocks.map((key) => {
                  const block = agreementSections[key];
                  if (!block?.implications?.length) return null;
                  return (
                    <div key={key}>
                      <h4>{block.header}</h4>
                      <ul>
                        {block.implications.map((line, idx) => (
                          <li key={idx}>{line}</li>
                        ))}
                      </ul>
                    </div>
                  );
                })}

                <div className="agreement-signatures">
                  <div className="agreement-sign-block">
                    {!signature ? (
                      <button
                        type="button"
                        className="agreement-sign-placeholder"
                        data-track-id="expectation_open_signature_modal"
                        onClick={() => setModalOpen(true)}
                      >
                        Your Sign Here
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="agreement-sign-script agreement-sign-script--learner"
                        data-track-id="expectation_edit_signature"
                        onClick={() => !showFilledHeader && setModalOpen(true)}
                        disabled={showFilledHeader}
                      >
                        {signature}
                      </button>
                    )}
                    <div className="agreement-sign-name">{user?.name || parsed?.user?.name}</div>
                    <div className="agreement-sign-role">{superBatchName}</div>
                  </div>
                  <div className="agreement-sign-block agreement-sign-block--founder">
                    <div className="agreement-sign-script">Anshuman</div>
                    <div className="agreement-sign-name">Anshuman Singh</div>
                    <div className="agreement-sign-role">Co-Founder, Scaler</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {!showFilledHeader ? (
            <div className="cta-row es-expectation-cta">
              <div className="status-line">
                <i className="ph ph-pen-nib" aria-hidden />
                <span>Signing this agreement is required to complete your onboarding</span>
              </div>
              <div className="es-expectation-cta-actions">
                <div className="es-expectation-cta-left">
                  {showTurnstile ? (
                    <div className="es-turnstile-host">
                      <Turnstile
                        ref={turnstileRef}
                        siteKey={TURNSTILE_SITE_KEY}
                        onSuccess={(token) => setTurnstileToken(token || "")}
                        onExpire={() => setTurnstileToken("")}
                        onError={() => setTurnstileToken("")}
                        options={{
                          action: "expectation_setting_form",
                          appearance: "always",
                        }}
                      />
                    </div>
                  ) : null}
                  {SKIP_TURNSTILE ? (
                    <p className="es-turnstile-dev-hint">Captcha skipped (dev only).</p>
                  ) : null}
                  {turnstileMissing ? (
                    <p className="es-inline-error">
                      Set <code className="es-code">VITE_TURNSTILE_SITE_KEY</code> in Railway /{" "}
                      <code className="es-code">.env</code> (see <code className="es-code">.env.example</code>
                      ).
                    </p>
                  ) : null}
                </div>
                <div className="es-expectation-cta-right">
                  <button
                    type="button"
                    className="button"
                    data-track-id="expectation_sign_off_submit"
                    disabled={submitMutation.isPending || !signature}
                    onClick={handleSignOff}
                  >
                    Sign off document {!submitMutation.isPending ? <i className="ph ph-arrow-right" aria-hidden /> : null}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="es-post-sign">
              <button
                type="button"
                className="button"
                data-track-id="expectation_continue_to_letter"
                onClick={onContinueToLetter}
              >
                Continue to onboarding letter <i className="ph ph-arrow-right" aria-hidden />
              </button>
            </div>
          )}
        </main>
      </div>

      <SignatureModal
        open={modalOpen}
        initialName={signature || user?.name || parsed?.user?.name || ""}
        onClose={() => setModalOpen(false)}
        onConfirm={(sig) => {
          setSignature(sig);
          setModalOpen(false);
        }}
      />

      {submitOverlay ? <div className="es-submit-overlay">Submitting…</div> : null}
    </section>
  );
}
