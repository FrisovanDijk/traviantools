<template>
    <CardContainer title="Time until next village" @close:view="$emit('close:view')">
        <div @change="calculateTime"
             class="flex flex-col mb-2 justify-between px-2"
        >

            <label class="text-sm uppercase"><input class="w-20 border px-1 mx-1" type="number" v-model="cpLeft" min="0"> CP until next village</label>
            <label class="mt-1 text-sm uppercase"><input class="w-20 border px-1 mx-1" type="number" v-model="dailyCp" min="0"> Daily cp</label>
            <label class="mt-1 text-sm uppercase"><select class="w-24 border px-1 mx-1" type="number" v-model="helmet">
                <option v-for="helmet in helmets"
                        :key="helmet.cp"
                >{{ helmet.name }}</option>
            </select> Helmet</label>

            <div class="mt-2">
                <div class="flex text-sm uppercase">
                    <p class="mr-24">Parties</p>
                    <p class="mr-12 pr-2">CP</p>
                    <p class="">TH level</p>
                </div>
                <div class="mt-1"
                     v-for="(party, index) in parties"
                     :key="index"
                >
                    <label class="mt-1 text-sm uppercase"><input class="w-12 border px-1 mx-1" type="number" v-model="party.amount" min="0"></label>
                    <label class="mt-1 text-sm uppercase">
                        <select v-model="party.type"
                                class="w-20 border px-1 mr-1"
                        >
                            <option>Small</option>
                            <option>Great</option>
                        </select>
                    </label>
                    <label class="mt-1 text-sm uppercase">
                        <input class="w-16 border px-1 mx-1"
                               type="number"
                               v-model="party.cp"
                               min="0"
                               :max="(party.type === 'Small' ? 500 : 2000)"
                               :disabled="party.type === 'Great'"
                        >
                    </label>
                    <label class="mt-1 text-sm uppercase">
                        <select v-model="party.townHall"
                                class="w-12 border px-1 mx-1"
                        >
                            <option v-for="(item, index) in 20" :key="index">{{ item }}</option>
                        </select>
                    </label>
                    <button class="bg-red-400 px-2 pb-1 rounded text-xl leading-none hover:bg-red-300"
                            @click="removeParty(party)"
                    >
                        -
                    </button>
                </div>
                <div class="mt-2 flex justify-end">
                    <button class="bg-green-400 px-1 pb-1 rounded text-xl leading-none hover:bg-green-300"
                            @click="addParty"
                    >
                        +
                    </button>
                </div>
            </div>
        </div>

        <h2 class="mt-2 py-1 mx-2 font-bold">Time</h2>
        <div class="bg-yellow-200 p-2">
            <div class="flex items-center"><ResImg class="mr-2" type="cp"></ResImg> {{ dailyCpResult }} CP/day</div>
            <div class="mt-1">
                {{ time.days }} <span class="text-sm uppercase pr-1">days</span>
                {{ time.hours }} <span class="text-sm uppercase pr-1">hours</span>
                {{ time.minutes }} <span class="text-sm uppercase">mins</span>
            </div>
        </div>
    </CardContainer>
</template>

<script>
    import CardContainer from "./molecules/CardContainer"
    import ResImg from "./atoms/ResImg";

    export default {
        components: {
            CardContainer,
            ResImg
        },
        data() {
            return {
                cpLeft: 0,
                dailyCp: 0,
                helmet: 'None',
                parties: [],
                time: {
                    days: 0,
                    hours: 0,
                    minutes: 0
                },
                helmets: [
                    { name: 'None', cp: 0},
                    { name: 'Gladiator', cp: 100},
                    { name: 'Tribune', cp: 400},
                    { name: 'Consul', cp: 1600},
                ],
                dailyCpResult: 0
            }
        },
        mounted() {
            this.addParty()
        },
        methods: {
            addParty() {
                this.parties.push({
                    amount: 0,
                    type: 'Small',
                    cp: 500,
                    townHall: 1
                })
            },
            removeParty(party) {
                this.parties.splice(this.parties.indexOf(party), 1)
            },
            calculateTime() {
                const dailyCp = Number(this.dailyCp)
                const dailyHelmetCp = this.helmets.find(o => o.name === this.helmet).cp

                // Calculate Daily CP from parties
                let dailyPartyCp = 0
                for(let i = 0; i < this.parties.length; i++) {
                    const party = this.parties[i]

                    // Calculate party CP
                    let partyCp = party.cp
                    if(party.type === 'Small' && party.cp > 500) partyCp = 500
                    if(party.type === 'Great') partyCp = (dailyCp > 2000 ? 2000 : dailyCp)
                    const partiesCp = party.amount * partyCp

                    // Calculate party duration
                    const baseTime = (party.type === 'Small' ? "24:00:00" : "60:00:00")
                    const duration = this.celebrationDuration(baseTime, party.townHall)

                    const partiesCpDaily = partiesCp / (duration / 24)

                    // Calculate daily party CP and add to total
                    dailyPartyCp += partiesCpDaily
                }

                const totalProduction = (dailyCp + dailyHelmetCp + dailyPartyCp)

                // Time fractions for CP-ready
                const daysfraction = (this.cpLeft / totalProduction)
                const days = Math.floor(daysfraction)
                const hoursfraction = (daysfraction - days) * 24
                const hours = Math.floor(hoursfraction)
                const minutesfraction = (hoursfraction - hours) * 60
                const minutes = Math.round(minutesfraction)

                this.dailyCpResult = Math.round(totalProduction)
                this.time.days = days
                this.time.hours = hours
                this.time.minutes = minutes
            },
            celebrationDuration(base_time, level) {
                const timesplit = base_time.split(':')
                const seconds = (+timesplit[0]) * 60 * 60 + (+timesplit[1]) * 60 + (+timesplit[2])

                return seconds * Math.pow(0.964, level - 1) / 3600
            }
        }
    }
</script>
