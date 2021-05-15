//This is my model class which will represent an individual contact
export interface IContact {
    id: string;
    fname: string;
    lname: string;
    phone: string;

    // future stages
    email: string;

    // 2 approaches that come to my mind for storing images
    // 1. Store url/path where the image is stored
    // 2. Store base64 encoded values
    picture: string;
}