import * as moment from 'moment';

interface Entry {
    id?: string;
    deleted?: boolean;
    value?: number;
    type?: string;
    status?: string;
    ts?: number;
}

interface EntryWrapper {
    data?: Entry[];
}

interface PatientResponseDataInterfaces {
    metrics: {
        temperature?: EntryWrapper;
        weight?: EntryWrapper;
        bloodpressure?: EntryWrapper;
    };
    ts: number;
}

class PatientModel {
    public recentMetrics: {
        bloodpressureLast?: EntryWrapper;
        bloodpressureToday?: EntryWrapper;
        temperatureLast?: EntryWrapper;
        temperatureToday?: EntryWrapper;
        weightLast?: EntryWrapper;
        weightToday?: EntryWrapper;
    } = {};

    private filterLatestReadings(overviewData: PatientResponseDataInterfaces[], metric: string): any {
        let readings = {};
        overviewData.forEach((day) => {
            let entry = day.metrics[metric];
            if ((this.recentMetrics[`${metric}Today`] && this.recentMetrics[`${metric}Last`]) ||
                (readings[`${metric}Today`] && readings[`${metric}Last`])) {
                return;
            }
            if (entry.data) {
                // Filter out deleted entries, and sort remaining by timestamp in descending order
                entry.data = entry.data.filter((entry) => (entry.status !== 'removed' && !entry.deleted));
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
