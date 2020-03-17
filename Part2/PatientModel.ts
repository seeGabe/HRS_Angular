import * as moment from 'moment';

interface Entry { // Having all properties optional seems unorthodox, at the very least we should be enforcing the ID property.
	id: string; // ID is a property that should be required on all Entries
	deleted: boolean;
	status: string;
	ts: number; // This property is used in another interface and that makes me think it should be required.
	// Also, we should rename this to timestamp because it is a better descriptor of what this propterty value is used for
	value?: number;
	type?: string;
}

interface EntryWrapper {
	data: Entry[]; // with this being the only property, it would make sense that this prop is mandatory
}

interface PatientResponseDataInterfaces {
	metrics: {
		temperature?: EntryWrapper;
		weight?: EntryWrapper;
		bloodpressure?: EntryWrapper;
	};
	ts: number; // Like above, we should use a better name for this property for clarity
}

// Take this out of the patient model class but still use it to enforce the proper types 
interface RecentMetrics {
	bloodpressureLast?: EntryWrapper;
	bloodpressureToday?: EntryWrapper;
	temperatureLast?: EntryWrapper;
	temperatureToday?: EntryWrapper;
	weightLast?: EntryWrapper;
	weightToday?: EntryWrapper;
}

// To use this class in our app, we should export this class
export class PatientModel {
	public recentMetrics: RecentMetrics = {};

	/*  FilterLatestReadings function takes in two parameters and returns the current and last readings data of a specific vital metric.
		The function loops through each item in the overviewData array to ultimately return the current and previous day's readings of a given metric.

		@param overviewData is an array that contains objects holding the metric data entries and a single timestamp.
		@param metric is a string value that would be used to specify which data metric to read/record from the overviewData object.

		First, we check if there are recentMetrics that have already been taken for the day.
		Assuming that there is no comprehensive data in recentMetrics, it then continues to execute a forEach loop on the overviewData parameter.
		Before starting to assign values to the readings object, we ignore any deleted data and stop execution if there is no data left in the entry object's data parameter.
		Then, we would check the timestamps in order to determine which value we should assign to the desired metric's 'Last' and 'First' properties in the readings object. 
	*/
	public filterLatestReadings(overviewData: Array<PatientResponseDataInterfaces>, metric: string): any { // Enforce an Array of a type in this fashion to use the built-in array methods
		// if we have the data collected already, return it before going through the rest of the code
		if (this.recentMetrics[`${metric}Today`] && this.recentMetrics[`${metric}Last`]) {
			// the condition below would always evaluate to false because the readings object is set to be empty when this function runs
			// (readings[`${metric}Today`] && readings[`${metric}Last`]) 
			return this.recentMetrics;
		}

		let readings = {};
		overviewData.forEach((day) => {
			const entry = day.metrics[metric];
			if (entry.data) {
				// Filter out deleted entries, and sort remaining by timestamp in descending order
				entry.data = entry.data.filter((item) => (item.status !== 'removed' && !item.deleted)); // change name to eliminate any confusion with using the name 'entry' so much
				if (!entry.data.length) {
					return;
				}
				entry.data.sort((entry1, entry2) => entry2.ts - entry1.ts);
				// Assign the last reading if today's exists already.
				if (readings[`${metric}Today`] && !readings[`${metric}Last`]) {
					readings[`${metric}Last`] = entry.data[0];
				} else {
					// Make sure reading was entered today, else save an empty object as today's reading
					readings[`${metric}Today`] = (moment().diff(entry.ts, 'days') === 0) ? entry.data[0] : {};
				}
				// If there are multiple entries, and today's reading has been assigned,
				// assign the second to last entry as the last reading
				if (entry.data[1] && readings[`${metric}Today`] && !readings[`${metric}Last`]) {
					readings[`${metric}Last`] = entry.data[1];
				}
			} else {
				if (entry && entry.ts && !entry.deleted && entry.status !== 'removed') {
					if (moment().diff(day.ts, 'days') < 1) {
						if (!readings[`${metric}Today`]) {
							readings[`${metric}Today`] = entry;
						}
					} else {
						if (!readings[`${metric}Last`]) {
							readings[`${metric}Last`] = entry;
						}
					}
				}
			}
		});
		return readings;
	}
}
