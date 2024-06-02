# Friso's Travian Tools

Built with Vue 3 and Vite. [Live version on frisovandijk.com](https://www.frisovandijk.com/public/travian/)

## Features

Calculators for the effective management of a [Travian](https://www.travian.com) account. The design philosophy is to create tools that share knowledge of the game and make it more accessible, while not playing the game for you.

The tools included and their first version are:
   
   - Village
       - (1.0) Building costs
       - (1.0) Time to next village
       - (3.0) Res dev calculator showing production at field levels
       - (3.0) Village builder with presets
       - (3.2) CP cost calculator
   - Economy
       - (1.0) Merchant trips
       - (1.0) Total res
       - (2.3) ROI
       - (2.8) Optimal village builder
       - (1.0) Feeder traderoutes
   - Troops
       - (2.7) Troop training time
       - (2.7) Troop costs
       - (3.0) When to troop upgrades
       - (3.0) Crop scouter + cap sim

## Open ideas list

- [ ] Add Spartan troops and unique building (hospital)
- [ ] Calculator: Hero travel time and res gain from animal kills vs putting all points in resources
- [ ] Calculator: Hero damage from adventure based on adventure number and fighting strength
- [ ] Calculator: Easy troop attributes per tribe
- [ ] Add tasks to ultimateROI
- [ ] Ability to reorganise calculators on the screen
- [ ] Account for server speed in: feeder automation, res production overview, ROI, cropscouter, troop training times
- [ ] Bug: build sim shows crop to 10 and mill to 4, discarding bakery
- [ ] Bug: opening the same calculator mulitple times and closing one closes the last one. Sometimes two of the same calculators opened after one another are coupled with data also.

## Completed 

- [x] Bug: Fix deleting tab (always deletes the first now)
- [x] ROI calculator (how long for res to pay back)
- [x] ROI calculator: building ROI simulate putting a field to 10
- [x] Also show total without crop in total resources
- [x] Add hospital to NPCCalculator
- [x] Add hour selector to feeder automation
- [x] Troop numbers based on buildings, bonuses and training time
- [x] Training time for given number of troops based on modifiers (hospital, bonuses, helmet)
- [x] Simming build creator --> now ultimateROI
- [x] Naming calculators (making title editable)
- [x] v3.0
    - [X] Redesign menu and icons
    - [X] Differentiate menu categories with colours
    - [X] Hover tooltip on icon
    - [X] Crop scouter + cap sim
    - [X] Res dev calculator showing production at field levels
    - [X] Village builder with presets:
      - 500 CP feeder
      - 1000 CP feeder
      - NPC village
      - 15c lv18
      - 15c lv19
      - 9c lv18
      - hammer
      - anvil
      - greyzone settle
    - [X] When to upgrade troop in smithy
    - [X] New tribe select component
    - [X] Improve default state
    - [X] Fix makeshift wall and stone wall stats
    - [X] Add HDT to troop cost calc
    - [X] Add Waterworks to ROI calculator
    - [X] Use a more efficient design to display calculators
    - [X] Update help component text
- [x] Unify UI of older calculators to match new styling
- [x] CP efficiency overview

## Not under consideration
- [ ] When is great party worth it in cp/day (village cp vs. account cp), CP efficiency vs. goal
