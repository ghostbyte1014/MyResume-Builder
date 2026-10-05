# MyResume Builder — Bug Fix Update

> **Date:** 2026-10-05  
> **Branch:** main  
> **Scope:** QA audit corrections — no new features, no API changes

---

## Summary

A full QA audit of the codebase identified 10 correctness bugs ranging from critical data-loss
issues to silent visual regressions. All 10 have been fixed in this update. No third-party
dependencies were changed; no user-facing feature behavior was altered except where bugs were
directly causing wrong output.

---

## Fixes

### 🔴 Critical

#### 1. Resume import collapsed all jobs into a single entry
**File:** `src/utils/parser.js` — `prepareInputLines`, `parseResumeText`

`prepareInputLines` stripped blank lines via `.filter(Boolean)`. Those blank lines are the
paragraph separators that `splitIntoParagraphs` uses to split experience entries. The result
was that every job, bullet, date, and company name from an imported resume landed as a flat
list of bullets under one entry — regardless of how many positions the resume contained.

**Fix:** Removed `filter(Boolean)` so blank lines are preserved as empty strings through
the full parse pipeline. Added a leading-blank skip before the name read so resumes that
start with whitespace still parse correctly.

---

#### 2. Photo upload had no size limit — silent auto-save failure
**File:** `src/components/tabs/BuildTab.jsx` — `handlePhotoUpload`

`FileReader.readAsDataURL` converts a raw image to base64 with no size guard. A 3 MB photo
becomes ~4 MB of base64 inside the draft payload, which is written to `localStorage` every
second. When the payload exceeds the browser's storage quota, `localStorage.setItem` throws
and the `catch (e) { // ignore limits }` handler silently discards it. The user keeps typing
into a draft that is no longer being saved.

**Fix:** Added a 500 KB file-size check before `readAsDataURL`. If the image is too large,
a clear inline error message is shown explaining the limit and the reason.

---

#### 3. Restoring a JSON backup hard-crashed the app on entries without `bullets`
**Files:** `src/utils/jsonExporter.js` — `parseResumeJSON`, `src/utils/atsAnalyzer.js`

`parseResumeJSON` passed experience entries through as-is. Older or hand-edited backups may
omit the `bullets` array. On the next render, `atsAnalyzer.js` called `e.bullets.some(…)`
without a guard, throwing `TypeError: Cannot read properties of undefined (reading 'some')`.
This replaced the whole app with the ErrorBoundary screen.

**Fix:** `parseResumeJSON` now normalizes every experience entry to guarantee
`bullets: Array.isArray(e.bullets) ? e.bullets : []`. The `atsAnalyzer` section-completeness
check was also tightened to `(e.bullets || []).some(…)` as a defensive layer.

---

#### 4. Custom section order silently reset to default on every JSON round-trip
**File:** `src/utils/jsonExporter.js` — `parseResumeJSON`

The `sectionOrder` field was present in the exported payload but the `parseResumeJSON` return
object didn't include it. Every backup restore silently reverted to the hardcoded default
section order, discarding any custom arrangement the user had set.

**Fix:** `parseResumeJSON` now preserves `sectionOrder` from the backup, falling back to the
default array only when the field is absent or not a valid array.

---

#### 5. Layout, colors, fonts, and spacing reverted to defaults on every page refresh
**File:** `src/App.jsx` — `useState` initializers

The auto-save payload correctly included `layoutId`, `colorId`, `fontId`, `categoryId`,
`documentStyle`, `pageSize`, `fontSize`, `lineHeight`, and `sectionSpacing`. However, the
`useState` initializers for all nine of these fields used hardcoded defaults and never read
from localStorage. The README's stated "Tab & Reload Persistence" claim was false for all
design and typography settings.

**Fix:** Introduced a `readDraft()` helper that parses the localStorage draft once. All nine
design/typography `useState` initializers now restore their saved value through this helper,
falling back to the original defaults when no draft exists. The three separate localStorage
reads for `resume`, `jobDescription`, and `aiAnalysisResult` were consolidated into the same
pattern.

---

### 🟡 Medium

#### 6. ATS metric detector reported false-positive "quantified" bullets
**File:** `src/utils/atsAnalyzer.js` — `analyzeQuantifiableMetrics`

The regex `/\d+|%|\$|k\b|m\b|b\b/i` matched `k`, `m`, and `b` as word-boundary suffixes,
which are the final letters of extremely common English words (`work`, `team`, `web`,
`job`, `tab`, …). On a fully non-quantified bullet set, this inflated the metric percentage
by 30–60 points and presented misleading feedback to the user.

**Fix:** Replaced the suffix patterns with `\b\d+\.?\d*\s*[kmb]\b` — a number followed by
the scale suffix, not any word that ends in one of those letters.

---

#### 7. AI analysis spinner was frozen (wrong CSS keyframe name)
**File:** `src/components/tabs/AiTab.jsx`

The loading overlay and the run-analysis button both referenced
`animation: "spin 1s linear infinite"`. The only keyframe defined in the app is `rb-spin`
(in `App.jsx`). The `spin` keyframe does not exist, so both spinners rendered as static
icons with no animation.

**Fix:** Both references changed to `rb-spin 1s linear infinite`.

---

#### 8. DOCX exporter: user text inserted unescaped into HTML
**File:** `src/utils/docxExporter.js`

User-entered resume content (role names, company names, bullet text, etc.) was interpolated
directly into HTML template strings with no escaping. Characters like `&`, `<`, `>`, and `"`
in a bullet — for example `Led redesign of React <Modal> component` or `Smith & Co` —
would break the Word document's XML structure and could render incorrectly or not at all.

**Fix:** Added an `esc()` helper that escapes the five HTML special characters. Applied to
all user-supplied strings: `name`, `title`, `contactInfo`, `role`, `company`, `dates`,
bullet text, degree, school, and all list/project/reference lines.

---

#### 9. Date regex treated company-name words as month abbreviations
**File:** `src/utils/parser.js` — `extractDateRange`

The pattern `(?:[A-Za-z]{3,9}\.?\s+)?` before the year was intended to match optional month
names like "Jan" or "September". Because it accepted any 3–9 letter word, company-name
words like "Corp" matched as a "month", producing dates like `"Corp  2021 - Present"` and
dropping the company name from the entry.

**Fix:** Replaced the generic character class with an explicit named-month alternation
covering full and abbreviated forms (Jan/January through Dec/December).

---

#### 10. Location regex scanned the entire resume body, picking up section headers
**File:** `src/utils/parser.js` — `parseResumeText`

The `City, ST` pattern was matched against `contactText + " | " + fullText`. On resumes
where the contact block had no location, the regex would scan the body and match things
like `"EXPERIENCE\nEngineer, Acme Corp"` — inserting a newline and a job title into the
location field.

**Fix:** Location matching is now limited to `contactText` only (the first few header lines),
where a location legitimately belongs.

---

## Files Changed

| File | Changes |
|------|---------|
| `src/utils/parser.js` | Fixes 1, 9, 10; phone regex paren fix |
| `src/components/tabs/BuildTab.jsx` | Fix 2 |
| `src/utils/jsonExporter.js` | Fixes 3, 4 |
| `src/utils/atsAnalyzer.js` | Fix 3 (defensive guard), Fix 6 |
| `src/App.jsx` | Fix 5 |
| `src/components/tabs/AiTab.jsx` | Fix 7 |
| `src/utils/docxExporter.js` | Fix 8 |

---

## Not Changed in This Update

- **PDF export text layer** — The PDF is still rasterized (html2canvas → JPEG → jsPDF).
  This means the PDF has no searchable text layer and will not parse in ATS software.
  Fixing this requires swapping to a text-based PDF generator and is tracked as a separate
  architectural task.
- **Bundle size** — pdfjs + html2canvas + jsPDF are still eagerly loaded on first paint.
  Lazy-loading them is a separate performance task.
- **Tests / CI** — No test suite or linter was added in this pass. Adding one is recommended
  before the next feature cycle.
- **Billing / AI activation** — Handled through Gmail + future database; intentionally
  out of scope for code fixes.
