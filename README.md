# depgraph

## What this is
This is a tool where you list the tasks, skills, or items you want to achieve; along with which ones depend on others. Some things just can't be learned or done out of order, and once you have more than a few tasks, figuring out a valid sequence by hand gets confusing fast, especially if you're not even sure what the end goal looks like yet.

That's what depgraph solves: I built a dependency resolver with cycle detection that takes your tasks and their dependencies and outputs one valid order to complete them — or flags it as impossible if the dependencies contradict each other (e.g., A needs B, but B also needs A).

This is based on topological sorting and dependency graphs, the same concept that powers real systems like build tools deciding install order, or Docker deciding container startup order.

## Why I built it
I wanted hands-on practice applying DSA concepts to something real, rather than isolated practice problems — and a chance to use my Python skills on an actual end-to-end project instead of just exercises. I'm also someone who genuinely enjoys organizing and structuring things, so a project centered on sequencing and dependencies felt like a natural fit — it's part of why this moved from "an idea on a project list" to something I actually built to completion. I also enjoy UI/UX work, so beyond the core algorithm, I wanted to make the interface genuinely pleasant to use rather than a bare functional output.

## Status
🚧 In progress — currently building core graph logic.


<!-- This line was added on a practice branch to learn Git workflow. -->