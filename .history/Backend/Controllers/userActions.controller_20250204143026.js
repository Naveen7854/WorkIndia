import pg from "pg";
import crypto from "crypto";
import db from '../Models/database.js'



export const checkTrainAvailability = async (req,res)=>{
    const {start_station,end_station} = req.body;
    // console.log(req.user);
    try {
        if(!start_station || !end_station){
            return res.status(400).json({"Error" : "All Feilds are Required"});
        }
        const result1 = await db.query("SELECT * FROM trains WHERE start_station = ($1) and end_station = ($2)",[start_station,end_station]);
        return res.status(200).json(result1.rows);
    } catch (error) {
        console.log("Error in checkTrain Avaiability in userActions controller",error.message);
        return res.status(404).json({"Error":error.message});
    }
}

export const checkSeatsAvailability = async (req,res)=>{
    const {trainId} = req.body;
    try {
        if(!trainId){
            return res.status(404).json({"Error" : "All Feilds are Required"});
        }
        const result1 = await db.query("SELECT * FROM trains WHERE id = ($1)",[trainId]);
        if(result1.rows.length === 0){
            return res.status(404).json({"Error":"No Such Train found"});
        }
        return res.status(200).json({ message: "Seats available", seats: result1.rows[0].seats_available });
    } catch (error) {
        console.log("Error in check seats Avaiability in userActions controller",error.message);
        return res.status(404).json({"Error":error.message});
    }
}

export const bookTickets = async (req, res) => {
    const { trainId } = req.body;

    try {
        await db.query('BEGIN');

        if (!trainId) {
            await db.query('ROLLBACK');
            return res.status(400).json({ "Error": "Train ID is required" });
        }

        const result = await db.query('SELECT * FROM trains WHERE id = $1', [trainId]);
        if (result.rows.length === 0) {
            await db.query('ROLLBACK');
            return res.status(404).json({ "Error": "No train found with the specified ID" });
        }

        const train = result.rows[0];
        if (train.seats_available === train.seats_filled) {
            await db.query('ROLLBACK');
            return res.status(400).json({ "Error": "No available seats" });
        }

        const newSeatsFilled = train.seats_filled + 1;
        const bookingId = (crypto.randomBytes(4).readUInt32BE() % 1e9).toString().padStart(9, "0");
        const bookingResult = await db.query(
            "INSERT INTO bookings (user_id, user_name, user_email, train_id, start_station, end_station, booking_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [req.user.id, req.user.name, req.user.email, trainId, train.start_station, train.end_station, bookingId]
        );

        // Update train seat count
        await db.query("UPDATE trains SET seats_filled = $1 WHERE id = $2", [newSeatsFilled, trainId]);

        await db.query('COMMIT');
        return res.status(201).json(bookingResult.rows[0]);
    } catch (error) {
        await db.query('ROLLBACK');
        console.log("Error in bookTickets function:", error.message);
        return res.status(500).json({ "Error": "Unable to book tickets" });
    }
};


export const getBookingDetails = async (req,res)=>{
    const {booking_id} = req.body;
    try {
        if(!booking_id){
            return res.status(404).json({"Error":"Booking id is required"});
        }
        const result = await db.query("SELECT * FROM bookings WHERE booking_id = $1",[booking_id]);
        if( result.rows.length == 0){
            return res.status(404).json({ "Error" : "No Records found for Given booking id"});
        }

        return res.status(200).json(result.rows[0]);
    } catch (error) {
        console.log("Error in getBooking Details in userActions Controller",error.message);
        return res.status(200).json({"Error" : error.message});
    } 
}