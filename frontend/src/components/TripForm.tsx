"use client";

import { useState } from "react";
import { Calendar, Wallet, MapPin } from "lucide-react";
import api from "@/src/services/api";

export default function TripForm(){

const[loading,setLoading]=useState(false);

const[form,setForm]=useState({
destination:"",
start_date:"",
end_date:"",
budget:20000,
travel_style:"budget",
interests:"beaches, nightlife, food"
});

async function handleSubmit(e:React.FormEvent){
e.preventDefault();

setLoading(true);

try{

const response=await api.post("/trip",{
...form,
interests:form.interests.split(",").map(i=>i.trim())
});

alert(`Trip Created: ${response.data.id}`);

}
catch(err){

console.error(err);
alert("Failed");

}

setLoading(false);
}

return(

<div className="max-w-4xl mx-auto">

<form
onSubmit={handleSubmit}
className="glass glow rounded-3xl p-8 space-y-6"
>

<h2 className="text-3xl font-bold">
Plan Your Next Adventure
</h2>

<div className="grid md:grid-cols-2 gap-4">

<div className="space-y-2">

<label className="text-sm text-gray-300">
Destination
</label>

<div className="flex items-center glass rounded-xl px-4">

<MapPin size={18}/>

<input
className="bg-transparent p-3 w-full outline-none"
placeholder="Goa"
value={form.destination}
onChange={e=>setForm({...form,destination:e.target.value})}
/>

</div>

</div>

<div className="space-y-2">

<label className="text-sm text-gray-300">
Budget
</label>

<div className="flex items-center glass rounded-xl px-4">

<Wallet size={18}/>

<input
type="number"
className="bg-transparent p-3 w-full outline-none"
value={form.budget}
onChange={e=>setForm({...form,budget:Number(e.target.value)})}
/>

</div>

</div>

<div className="space-y-2">

<label className="text-sm text-gray-300">
Start Date
</label>

<div className="flex items-center glass rounded-xl px-4">

<Calendar size={18}/>

<input
type="date"
className="bg-transparent p-3 w-full outline-none"
value={form.start_date}
onChange={e=>setForm({...form,start_date:e.target.value})}
/>

</div>

</div>

<div className="space-y-2">

<label className="text-sm text-gray-300">
End Date
</label>

<div className="flex items-center glass rounded-xl px-4">

<Calendar size={18}/>

<input
type="date"
className="bg-transparent p-3 w-full outline-none"
value={form.end_date}
onChange={e=>setForm({...form,end_date:e.target.value})}
/>

</div>

</div>

</div>

<div className="space-y-2">

<label className="text-sm text-gray-300">
Travel Style
</label>

<select
className="glass rounded-xl p-3 w-full outline-none bg-transparent"
value={form.travel_style}
onChange={e=>setForm({...form,travel_style:e.target.value})}
>
<option value="budget">Budget</option>
<option value="mid-range">Mid Range</option>
<option value="luxury">Luxury</option>
</select>

</div>

<div className="space-y-2">

<label className="text-sm text-gray-300">
Interests
</label>

<input
className="glass rounded-xl p-3 w-full outline-none bg-transparent"
placeholder="beaches, nightlife, food"
value={form.interests}
onChange={e=>setForm({...form,interests:e.target.value})}
/>

</div>

<button
disabled={loading}
className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 font-semibold text-lg hover:scale-[1.02] transition"
>

{loading?"AI Agents Planning...":"Generate My Trip ✈️"}

</button>

</form>

</div>

);

}