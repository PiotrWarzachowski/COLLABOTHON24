export default interface Event {
    id: number;
    date: Date;
    title: string;
    type: 'training' | 'other';
    description: string;
    owner_uid: string;
}