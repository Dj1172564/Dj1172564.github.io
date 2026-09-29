# Recimama Community Guidelines

*Last updated: 28 September 2026*

Explore is where people share recipes with everyone who uses Recimama. These rules keep it a place worth browsing. You agree to them the first time you share a recipe, and they apply to everything you publish: the title, description, ingredients, steps, tags, photo, your name and your note.

## Share only what's yours

- Share recipes **you wrote yourself**, and photos **you took yourself**.
- Don't share anything copied from a cookbook, a magazine, a website, a video or another person, even if you've changed a few words. Recimama won't let you publish a recipe you imported from a website, read from a photographed page, added from Explore or received from someone else.
- Don't use someone else's name, logo or brand as if it were yours.

## Keep it about food, and keep it decent

There is **no tolerance** for objectionable content or abusive users. Don't share:

- anything hateful, or anything that attacks or demeans people for who they are
- sexual content or nudity
- threats, harassment or bullying, including in your name or note
- violent, graphic or shocking images
- anything illegal or dangerous, including recipes presented as safe that aren't
- spam, advertising, links or promotions, or anything that isn't a recipe
- other people's personal information

## Be careful with safety claims

Don't say a recipe is safe for an allergy or a medical condition. Cooks reading it can't check your ingredients, your kitchen or your packaging.

## If you see something wrong

Open the recipe, or long-press it in Explore, and tap **Report**. Choose a reason and, if you like, add a comment. You can also **Block** the cook, which hides everything they share from you and lets us know. Or **Hide** a single recipe.

If reporting in the app doesn't work, email **rodrigobayapps@gmail.com** with the recipe's title and the cook's name. Include your contact details if you want to hear back about a copyright or privacy complaint.

## What happens next

- **We review every report within 24 hours.**
- A recipe that breaks these guidelines is **taken down** for everyone.
- A cook who breaks them seriously or repeatedly is **blocked from Explore**, and everything they have shared disappears for everyone. Something clearly illegal, hateful or sexual can get a cook blocked the first time.
- Recimama checks words automatically when you publish and when recipes are shown. That check is a safety net, not permission: something that gets past it can still be taken down.
- If you think we got it wrong, email rodrigobayapps@gmail.com and we'll look again.

## Your recipes stay yours

Sharing a recipe lets everyone who uses Recimama read it and add a copy to their own library. You can take it down at any time from **Explore > More > Recipes you shared**. Copies people have already added stay in their libraries.

How we handle what you publish is explained in the [privacy policy](privacy.html).

---

<!--
DEVELOPER NOTES — remove before publishing.
- The in-app agreement text (worktree 1, RecipeKit ExploreGuidelines.summary) says, in four lines: share recipes you wrote and photos you took; nothing offensive, hateful, sexual or copied; breaking the rules means takedown and a block from Explore; anyone can report, and every report is looked at within 24 hours. This page matches those four lines and expands on them. If the summary changes, bump ExploreGuidelines.version so everyone is asked again, and update this page.
- "no tolerance for objectionable content or abusive users" is the wording App Review's standard 1.2 rejection asks for. Keep it.
- Report reasons in code: Offensive or hateful / Sexual content / Spam, or not a recipe / Copied from somebody else / Something else (ExploreReport.Reason.offered). Block files a `.blocked` report.
- "Hide" here means the existing "Hide this" (ExploreListingView.swift:176).
- The copyright-complaint line is there because 1.2 and 5.2 both expect a takedown route for rights holders. If you publish a DMCA-style agent address, add it here.
-->
