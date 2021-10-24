### Live Demo
Link: https://elastic-lamarr-0c1027.netlify.app/ \
The app requires you to enter valid credentials. You can visit [here](https://platform.symbl.ai/#/signup) to create a new account.

# Symbl Tracker Management UI

Symbl's Management API exposes REST endpoints to perform CRUD operations on `Tracker` entities. This is a frontend layer intended for a code-free interaction to view, create, update, and delete Trackers.

## Installation
You will need node and npm installed globally on your machine.

Run `npm install` to install all dependencies.\
Run `npm start` to start serving the frontend assets on `localhost:3000`.

## Note for Developers

Under the hood, the Tracker Management UI is making REST calls to Symbl's Management API. Below is the exhaustive list of available endpoints for `Tracker` entities.

| Operation  | Endpoint |
| ------------- | ------------- | 
| Create Tracker | POST `v1/manage/tracker` |
| Create Trackers in Bulk | POST `v1/manage/trackers` | 
| Get Trackers | GET `v1/manage/tracker` |
| Get Tracker by ID | GET `v1/manage/tracker/:trackerId` |
| Get Tracker by name | GET `v1/manage/tracker?name={trackerName}` |
| Update Tracker | PUT `v1/manage/tracker/:trackerId` |
| Delete record | DELETE `v1/manage/tracker/:trackerId` |

## More information

**What are Symbl Trackers?** \
https://docs.symbl.ai/docs/concepts/trackers/

**Consuming Trackers with Management APIs** \
https://docs.symbl.ai/docs/management-api/trackers/overview/#consuming-trackers-with-management-api

**Consuming Trackers with Async APIs** \
https://docs.symbl.ai/docs/management-api/trackers/overview/#consuming-trackers-with-async-apis

**Consuming Trackers with Streaming API** \
https://docs.symbl.ai/docs/management-api/trackers/overview/#consuming-trackers-with-streaming-api

## Future Support

This app is currently limited to creating trackers one by one. If a user wants to register multiple trackers, he/she needs to create them each individually. It would be nice to have UI support for bulk-creation. The most straightforward solution is to have some interface where you can copy & paste the raw JSON (array of trackers) and hence create multiple trackers within a click or two. We are always open to feedback & suggestion on how the UX can be improved.

## Preview

<img width="1168" alt="Screen Shot 2021-10-21 at 9 48 07 AM" src="https://user-images.githubusercontent.com/32221114/138321918-2c768539-2a02-406a-9b85-eefec5e2e5e5.png">
<img width="1137" alt="Screen Shot 2021-10-21 at 9 51 26 AM" src="https://user-images.githubusercontent.com/32221114/138322380-62e9ac8b-598c-4d6d-991e-53dcf69ef737.png">
<img width="1125" alt="Screen Shot 2021-10-21 at 9 53 38 AM" src="https://user-images.githubusercontent.com/32221114/138322740-21184c92-52df-4ad7-9dd2-4ae9a9939934.png">
