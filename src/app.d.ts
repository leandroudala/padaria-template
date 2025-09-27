// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { JWTPayload } from '$lib/server/auth';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: JWTPayload;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}export {};