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
- Weekly calendar positions use a pure time parser and a dedicated scrollable timeline; never invent a start time or duration for activities without one.
