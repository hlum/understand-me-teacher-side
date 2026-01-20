import { remoteConfig } from "../firebase/firebase";
import { fetchAndActivate, getString } from "firebase/remote-config";

const STORAGE_KEY = "cached_api_endpoint";
const REMOTE_KEY = "API_ENDPOINT";
const DEFAULT_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || "http://localhost:8080/";

export class RemoteConfigManager {
	private static instance: RemoteConfigManager;
	private apiEndpoint: string;

	private constructor() {
		// Load cached endpoint from localStorage or use default
		const cached = localStorage.getItem(STORAGE_KEY);
		this.apiEndpoint = cached || DEFAULT_ENDPOINT;
	}

	public static getInstance(): RemoteConfigManager {
		if (!RemoteConfigManager.instance) {
			RemoteConfigManager.instance = new RemoteConfigManager();
		}
		return RemoteConfigManager.instance;
	}

	/**
	 * Fetch Remote Config values from Firebase
	 */
	public async fetchRemoteConfig(): Promise<void> {
		try {
			const activated = await fetchAndActivate(remoteConfig);
			if (activated) {
				console.log("Remote Config fetched and activated");
			} else {
				console.log("Remote Config already activated");
			}

			const newEndpoint = getString(remoteConfig, REMOTE_KEY);
			if (newEndpoint) {
				this.apiEndpoint = newEndpoint;
				localStorage.setItem(STORAGE_KEY, newEndpoint);
				console.log(`API Endpoint updated to: ${newEndpoint}`);
			}
		} catch (error) {
			console.error("Failed to fetch Remote Config:", error);
		}
	}

	/**
	 * Get the current API endpoint
	 */
	public getApiEndpoint(): string {
		return this.apiEndpoint;
	}
}
