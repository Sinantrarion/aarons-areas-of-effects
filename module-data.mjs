Hooks.on("init", () => {
  CONFIG.DND5E.characterFlags['isNotCaster'] = {
    name: "Is Mute Geneseed?",
    hint: "",
    section: "Genepool",
    type: Boolean,
    default: false
  }

  CONFIG.DND5E.characterFlags['casterType'] = {
    name: "Geneseed",
    hint: "",
    section: "Genepool",
    type: String,
    choices: {
      thalergic: "Thalergic", // Holy
      thanurgic: "Thanurgic", // Unholy
      versatile: "Versatile"
    }
  }

  Hooks.on('createActiveEffect', onCreateEffect);
  Hooks.on('deleteActiveEffect', onDeleteEffect);
});
//      Holy--              Holy -              Holy +                Holy++
const ThalergicEffects = ["Thalergic Overload♱", "Meager Thanergy♱", "Bountiful Thanergy♱", "Thanurgic Overload♱"];
//      UnHoly--            UnHoly -            UnHoly +              UnHoly++
const ThanurgicEffects = ["Thanurgic Overload⛧", "Meager Thalergy⛧", "Bountiful Thalergy⛧", "Thalergic Overload⛧"];

const VersatileEffects = ["Thanurgic Overload★", "Thalergic Overload★", "Meager Thalergy⛧", "Bountiful Thalergy⛧", "Meager Thanergy♱", "Bountiful Thanergy♱"];

const AllEffects = ["Thanurgic Overload★", "Thalergic Overload★",
                    "Thanurgic Overload⛧", "Thalergic Overload⛧",
                    "Meager Thalergy⛧", "Bountiful Thalergy⛧",
                    "Thalergic Overload♱", "Thanurgic Overload♱",
                    "Meager Thanergy♱", "Bountiful Thanergy♱"];

function onDeleteEffect(effect) {
  var actor = effect.parent;
  if (!effect.flags?.aaron) return;

  const aefs = Object.entries(actor.effects)[4][1];
  const sorted = aefs.filter(aef => aef.flags?.aaron);

  if (sorted.length == 0) {
    RemoveAll(actor.uuid);
  }
}

function onCreateEffect(effect) {
  var actor = effect.parent;
  if (actor.flags?.dnd5e?.isNotCaster) return;
  if (actor.flags?.dnd5e?.casterType == undefined) return;
  if (!effect.flags?.aaron) return;

  const aefs = Object.entries(actor.effects)[4][1];
  const sorted = aefs.filter(aef => aef.flags?.aaron);

  let totalResult = sorted.reduce((total, currentObject) => total + currentObject.flags.aaron, 0);
  if (totalResult > 2) { totalResult = 2; }
  if (totalResult < -2) { totalResult = -2; }

  let uuid = actor.uuid;

  switch (actor.flags.dnd5e.casterType) {
    case "thalergic":
      HolyFunction(totalResult, uuid);
      break;

    case "thanurgic":
      UnholyFunction(totalResult, uuid);
      break;

    case "versatile":
      VersatileFunction(totalResult, uuid);
      break;

    default:
      break;
  }
}

function RemoveAll(uuid) {
  AllEffects.forEach(async element => {
    let hasEffectApplied = await game.dfreds.effectInterface.hasEffectApplied(element, uuid);
    if (hasEffectApplied) {
      await game.dfreds.effectInterface.removeEffect({ effectName: element, uuid });
    }
  });
  return null;
}

function RemoveHoly(uuid) {
  ThalergicEffects.forEach(async element => {
    let hasEffectApplied = await game.dfreds.effectInterface.hasEffectApplied(element, uuid);
    if (hasEffectApplied) {
      await game.dfreds.effectInterface.removeEffect({ effectName: element, uuid });
    }
  });
  return null;
}

function RemoveUnholy(uuid) {
  ThanurgicEffects.forEach(async element => {
    let hasEffectApplied = await game.dfreds.effectInterface.hasEffectApplied(element, uuid);
    if (hasEffectApplied) {
      await game.dfreds.effectInterface.removeEffect({ effectName: element, uuid });
    }
  });
  return null;
}

function RemoveVersatile(uuid) {
  VersatileEffects.forEach(async element => {
    let hasEffectApplied = await game.dfreds.effectInterface.hasEffectApplied(element, uuid);
    if (hasEffectApplied) {
      game.dfreds.effectInterface.removeEffect({ effectName: element, uuid });
    }
  });
  return null;
}

function HolyFunction(totalResult, uuid) {
  switch (totalResult) {
    case 0:
      RemoveHoly(uuid);
      break;
    case -2:
      RemoveHoly(uuid);
      game.dfreds.effectInterface.addEffect({ effectName: ThalergicEffects[0], uuid });
      break;
    case -1:
      RemoveHoly(uuid);
      game.dfreds.effectInterface.addEffect({ effectName: ThalergicEffects[1], uuid });
      break;
    case 1:
      RemoveHoly(uuid);
      game.dfreds.effectInterface.addEffect({ effectName: ThalergicEffects[2], uuid });
      break;
    case 2:
      RemoveHoly(uuid);
      game.dfreds.effectInterface.addEffect({ effectName: ThalergicEffects[3], uuid });
      break;
    default:
      return;
  }
}

function UnholyFunction(totalResult, uuid) {
  switch (totalResult) {
    case 0:
      RemoveUnholy(uuid);
      break;
    case -2:
      RemoveUnholy(uuid);
      game.dfreds.effectInterface.addEffect({ effectName: ThanurgicEffects[0], uuid });
      break;
    case -1:
      RemoveUnholy(uuid);
      game.dfreds.effectInterface.addEffect({ effectName: ThanurgicEffects[1], uuid });
      break;
    case 1:
      RemoveUnholy(uuid);
      game.dfreds.effectInterface.addEffect({ effectName: ThanurgicEffects[2], uuid });
      break;
    case 2:
      RemoveUnholy(uuid);
      game.dfreds.effectInterface.addEffect({ effectName: ThanurgicEffects[3], uuid });
      break;
    default:
      return;
  }
}

function VersatileFunction(totalResult, uuid) {
  switch (totalResult) {
    case 0:
      RemoveVersatile(uuid);
      break;
    case -2: // All unholy
      RemoveVersatile(uuid);
      game.dfreds.effectInterface.addEffect({ effectName: VersatileEffects[0], uuid });
      break;
    case -1:
      RemoveVersatile(uuid);
      game.dfreds.effectInterface.addEffect({ effectName: ThalergicEffects[2], uuid });
      game.dfreds.effectInterface.addEffect({ effectName: ThanurgicEffects[1], uuid });
      break;
    case 1:
      RemoveVersatile(uuid);
      game.dfreds.effectInterface.addEffect({ effectName: ThalergicEffects[1], uuid });
      game.dfreds.effectInterface.addEffect({ effectName: ThanurgicEffects[2], uuid });
      break;
    case 2: // All holy
      RemoveVersatile(uuid);
      game.dfreds.effectInterface.addEffect({ effectName: VersatileEffects[1], uuid });
      break;
    default:
      return;
  }
}