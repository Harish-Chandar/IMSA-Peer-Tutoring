//usage: tsx clear-tutors.ts for only deleting images
//usage: tsx clear-tutors.ts bulk to clear all images from the cloudinary peer-tutoring folder
import sqlite3 from "sqlite3";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config();

// Configure Cloudinary
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
	api_key: process.env.CLOUDINARY_API_KEY!,
	api_secret: process.env.CLOUDINARY_API_SECRET!,
});

interface Tutor {
	id: number;
	fname: string;
	lname: string;
	image: string;
}

/**
 * Extract Cloudinary public_id from a Cloudinary URL
 * Example URL: https://res.cloudinary.com/[cloud]/image/upload/v[version]/[folder]/[public_id].[format]
 */
function extractPublicId(cloudinaryUrl: string): string | null {
	if (!cloudinaryUrl || !cloudinaryUrl.includes("res.cloudinary.com")) {
		return null;
	}

	try {
		// Match the pattern after /upload/ and remove version if present
		const match = cloudinaryUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
		if (match && match[1]) {
			return match[1]; // This includes the folder path
		}
		return null;
	} catch (error) {
		console.error("Error extracting public_id:", error);
		return null;
	}
}

/**
 * Delete a single image from Cloudinary
 */
async function deleteImageFromCloudinary(
	imageUrl: string,
	tutorName: string
): Promise<boolean> {
	const publicId = extractPublicId(imageUrl);

	if (!publicId) {
		console.log(
			`Skipping ${tutorName}: No valid Cloudinary public_id found`
		);
		return false;
	}

	try {
		console.log(`Deleting image for ${tutorName}: ${publicId}`);
		const result = await cloudinary.uploader.destroy(publicId);

		if (result.result === "ok") {
			console.log(`Successfully deleted image for ${tutorName}`);
			return true;
		} else if (result.result === "not found") {
			console.log(
				`Image not found for ${tutorName} (may already be deleted)`
			);
			return true;
		} else {
			console.error(
				`Failed to delete image for ${tutorName}:`,
				result.result
			);
			return false;
		}
	} catch (error) {
		console.error(`Error deleting image for ${tutorName}:`, error);
		return false;
	}
}

/**
 * Delete all images from the peer-tutoring folder in Cloudinary
 */
async function deleteAllCloudinaryImages(): Promise<number> {
	console.log("Cleaning up ALL images from Cloudinary folder...");

	try {
		let deletedCount = 0;
		let hasMore = true;
		let nextCursor: string | undefined = undefined;

		while (hasMore) {
			const result = await cloudinary.api.resources({
				type: "upload",
				prefix: "peer-tutoring/",
				max_results: 500,
				next_cursor: nextCursor,
			});

			if (result.resources && result.resources.length > 0) {
				console.log(
					`Found ${result.resources.length} images to delete...`
				);

				const publicIds = result.resources.map(
					(resource: any) => resource.public_id
				);

				for (let i = 0; i < publicIds.length; i += 100) {
					const batch = publicIds.slice(i, i + 100);
					try {
						const deleteResult =
							await cloudinary.api.delete_resources(batch);
						const successCount = Object.values(
							deleteResult.deleted
						).filter((status) => status === "deleted").length;
						deletedCount += successCount;
						console.log(`Deleted batch of ${successCount} images`);
					} catch (error) {
						console.error("Error deleting batch:", error);
					}
				}
			}

			nextCursor = result.next_cursor;
			hasMore = !!nextCursor;
		}

		console.log(
			`Cleanup complete! Deleted ${deletedCount} images from Cloudinary`
		);
		return deletedCount;
	} catch (error) {
		console.error("Error listing Cloudinary resources:", error);
		return 0;
	}
}

/**
 * Retrieve all tutors from the database
 */
function getAllTutors(db: sqlite3.Database): Promise<Tutor[]> {
	return new Promise((resolve, reject) => {
		db.all(
			"SELECT id, fname, lname, image FROM tutors",
			[],
			(err: Error | null, rows: Tutor[]) => {
				if (err) {
					reject(err);
				} else {
					resolve(rows || []);
				}
			}
		);
	});
}

/**
 * Delete all tutors from the database
 */
function deleteAllTutors(db: sqlite3.Database): Promise<number> {
	return new Promise((resolve, reject) => {
		db.run("DELETE FROM tutors", function (err: Error | null) {
			if (err) {
				reject(err);
			} else {
				resolve(this.changes);
			}
		});
	});
}

/**
 * Reset the tutors table auto-increment counter
 */
function resetAutoIncrement(db: sqlite3.Database): Promise<void> {
	return new Promise((resolve, reject) => {
		db.run(
			"DELETE FROM sqlite_sequence WHERE name='tutors'",
			(err: Error | null) => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			}
		);
	});
}

/**
 * Main execution function
 */
async function main() {
	console.log("CLEAR TUTORS & CLOUDINARY IMAGES");

	const dbPath = path.resolve("./peertutoringdb.sqlite");

	const args = process.argv.slice(2);
	const cleanupMode = args[0] || "individual";

	console.log(
		`Cleanup mode: ${cleanupMode === "bulk" ? "BULK" : "INDIVIDUAL"}`
	);

	const db = new sqlite3.Database(dbPath, (err) => {
		if (err) {
			console.error("Error opening database:", err.message);
			process.exit(1);
		} else {
			console.log("Connected to SQLite database.");
		}
	});

	try {
		if (cleanupMode === "bulk") {
			console.log(
				"WARNING: This will delete ALL images from the peer-tutoring folder in Cloudinary!"
			);
			console.log(
				"This includes any images that might not be associated with current tutors."
			);

			const deletedCount = await deleteAllCloudinaryImages();
			console.log(`Cloudinary cleanup: ${deletedCount} images deleted`);
		} else {
			console.log("Retrieving all tutors from database...");
			const tutors = await getAllTutors(db);
			console.log(`Found ${tutors.length} tutors`);

			if (tutors.length === 0) {
				console.log(
					"No tutors found in database. Nothing to clean up."
				);
			} else {
				console.log("Deleting tutor images from Cloudinary...");
				let successCount = 0;
				let skippedCount = 0;

				for (const tutor of tutors) {
					const tutorName = `${tutor.fname} ${tutor.lname}`;
					if (tutor.image && tutor.image.trim() !== "") {
						const success = await deleteImageFromCloudinary(
							tutor.image,
							tutorName
						);
						if (success) successCount++;
					} else {
						skippedCount++;
						console.log(`Skipping ${tutorName}: No image URL`);
					}
				}

				console.log(`Cloudinary cleanup complete:`);
				console.log(`  - Successfully deleted: ${successCount} images`);
				console.log(`  - Skipped (no image): ${skippedCount} tutors`);
			}
		}

		console.log("Deleting all tutors from database...");
		const deletedRows = await deleteAllTutors(db);
		console.log(`Deleted ${deletedRows} tutors from database`);

		console.log("Resetting auto-increment counter...");
		await resetAutoIncrement(db);
		console.log("Auto-increment counter reset");

		console.log("CLEANUP COMPLETE!");
	} catch (error) {
		console.error("Error during cleanup:", error);
		process.exit(1);
	} finally {
		db.close((err) => {
			if (err) {
				console.error("Error closing database:", err.message);
			} else {
				console.log("Database connection closed.");
			}
		});
	}
}

// Run the script
main().catch((error) => {
	console.error("Fatal error:", error);
	process.exit(1);
});
