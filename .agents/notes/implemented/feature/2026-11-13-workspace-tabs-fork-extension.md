# Agent Note: Workspace Tabs fork extension

Status: implemented

## Problem

Workspace and conversation navigation, compact window chrome, and warm styling need one installable extension in this fork. The upstream v0.4.18 layout has retired the old gallery and moved skin assets to satellite repositories.

## Decision

The extension lives in `packages/dsh-workspace-tabs` as `@linxin666/dsh-client-ui-workspace-tabs`. It is an optional browser-side Cordis plugin, with no host-side behavior, no npm release, and no default aggregate membership. Its browser code owns navigation and scoped styling together. It uses the upstream shared build preset and the current SDK cohort.

Native drag attributes and CSS apply only to a host reporting `data-platform="darwin"`. Other platforms retain the navigation controls. The package README owns installation, language, and host requirements.

## Alternatives considered

Keeping the package under the old skin directory would restore a retired registry and gallery just for this extension. The functional plugin boundary keeps those upstream removals intact.

Splitting the top bar and styling into two packages would introduce an extra install and lifecycle dependency for a single requested interface. The one-plugin boundary preserves the requested installation model.

## Consequences

The fork tracks the upstream architecture while retaining this optional extension. Users install the package explicitly through a local path. No running profile is rewritten by repository synchronization. Actual native window movement remains a desktop-host acceptance check; DOM platform tests verify the drag-marker boundary.

The imported attachment test fixtures canonicalize their temporary root on macOS before exercising the existing no-symlink policy; production path validation is unchanged.
