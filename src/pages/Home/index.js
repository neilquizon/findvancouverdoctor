import React from "react"

function Home() {
    return (
        <div>
            <div className="flex justify-between">
                <div>
                    <input placeholder="Search doctors" className="w-400" />
                </div>
                <button className="outlined-btn my-1">Register as a Doctor</button>
            </div>
        </div>
    )
}

export default Home