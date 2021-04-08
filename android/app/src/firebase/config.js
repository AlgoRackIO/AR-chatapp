import Firebase from 'firebase';

const firebaseconfig = {
    apiKey: 'AIzaSyBf_O82rvXjBOFlBLBqZsSj2RJxtPuWrVY',
    dataBaseURL: 'https://reactapp-308dd-default-rtdb.firebaseio.com/',
    projectID: 'reactapp-308dd',
    appID: '1:387972525332:android:32703789d38a9c60066601',
};

export default Firebase.initializeApp(firebaseconfig);