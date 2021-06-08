import * as RestAPI from "./rest_api";

const fetchTrackerById = trackerId => {
    return new Promise((resolve, reject) => {
        RestAPI.GET({
            path: `/manage/tracker/${trackerId}`
        })
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    });
}

const fetchTrackerByName = trackerName => {
    return new Promise((resolve, reject) => {
        RestAPI.GET({
            path: `/manage/tracker?name=${trackerName}`
        })
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    });
}

const fetchAllTrackers = () => {
    return new Promise((resolve, reject) => {
        RestAPI.GET({
            path: `/manage/trackers`
        })
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    });
}

const createTracker = tracker => {
    return new Promise((resolve, reject) => {
        RestAPI.POST({
            path: `/manage/tracker`,
            body: tracker
        })
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    });
}

const createTrackersInBulk = trackers => {
    return new Promise((resolve, reject) => {
        RestAPI.POST({
            path: `/manage/trackers`,
            body: trackers
        })
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    });
}

const updateTracker = (trackerId, payload) => {
    return new Promise((resolve, reject) => {
        RestAPI.PUT({
            path: `/manage/tracker/${trackerId}`,
            body: payload
        })
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    });
}

const deleteTracker = (trackerId) => {
    return new Promise((resolve, reject) => {
        RestAPI.DELETE({
            path: `/manage/tracker/${trackerId}`
        })
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    });
}

export {
    fetchTrackerById,
    fetchTrackerByName,
    fetchAllTrackers,
    createTracker,
    createTrackersInBulk,
    updateTracker,
    deleteTracker
};

