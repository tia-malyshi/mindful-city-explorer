<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the bundled Warsaw logo as the source for the public favicon; welcome photography uses a Lovable Assets pointer so uploaded media stays outside the source bundle.
- Localize display text through the shared language context and translation catalog, keeping event IDs and filter keys stable; store only the interface-language preference in browser storage after hydration.
- Keep pre-question language selection and post-onboarding language settings in focused components that share the same language context so changes do not reset questionnaire or activity state.
- Keep prototype questionnaire answers and editable profile name in shared screen state, and render profile actions in a focused menu; invitations use native sharing with clipboard and selectable-text fallbacks, without implying account creation.
- Weekly calendar positions use a pure time parser and a day-selected timeline under a seven-day strip to avoid nested and horizontal scrolling; never invent a start time or duration for activities without one.
- Personal account state and private data share one root provider and one auth subscription; browser Data API access uses owner RLS and a private file bucket, keeping media outside the source bundle.
- Reflections retain event metadata and media provenance; memories store original photo IDs and assemble existing photos without AI interpretation so sources remain inspectable.
- Questionnaire completion presents the shared account panel before discovery; example Insights stays explicitly marked as sample data and keeps saved reflection sources separate so presentation never implies fabricated personal results.
- Profile opens a focused interest overview derived from questionnaire choices and saved reflections; its connected branches and activity history expose original sources rather than fabricated personal events.
- Keep generated profile-preview fixtures in a browser-safe module and behind an explicit sample/personal selector; never persist or merge sample rows into account data, so demonstrations cannot masquerade as personal history.
