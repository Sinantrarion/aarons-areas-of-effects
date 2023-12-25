Hooks.on("init", () => {
  CONFIG.DND5E.characterFlags['isCaster'] = {
    name: "Is Caster?",
    hint: "Is the actor affected by spellcasting types",
    section: "Spellcasting Styles",
    type: Boolean,
    default: false
  }

  CONFIG.DND5E.characterFlags['casterType'] = {
    name: "Caster Type",
    hint: "Select a caster type (Must be caster to affect)",
    section: "Spellcasting Styles",
    type: String,
    choices: {
      holy: "Holy",
      unholy: "Unholy",
      versatile: "Versatile"
    }
  }

  Hooks.on('createActiveEffect', onCreateEffect);
  Hooks.on('deleteActiveEffect', onCreateEffect);
});

const HolyEffects = ["Holy-", "Holy--", "Holy++", "Holy+"];
const UnholyEffects = ["Unholy-", "Unholy--", "Unholy++", "Unholy+"];

function onCreateEffect(effect) {
  var actor = effect.parent;
  if (!actor.flags?.dnd5e?.isCaster) return;
  if (!effect.flags?.aaron) return;

  const aefs = Object.entries(actor.effects)[4][1];
  const sorted = aefs.filter(aef => aef.flags?.aaron);

  let totalResult = sorted.reduce((total, currentObject) => total + currentObject.flags.aaron, 0);

  let uuid = actor.uuid;

  switch (actor.flags.dnd5e.casterType) {
    case "holy":
      HolyFunction(totalResult, uuid);
      break;

    case "unholy":
      UnholyFunction(totalResult, uuid);
      break;

    case "versatile":
      VersatileFunction(totalResult, uuid);
      break;

    default:
      break;
  }
}

function RemoveHoly(uuid) {
  HolyEffects.forEach(async element => {
    let hasEffectApplied = await game.dfreds.effectInterface.hasEffectApplied(element, uuid);
    if (hasEffectApplied) {
      game.dfreds.effectInterface.removeEffect({ effectName: element, uuid });
    }
  });
}

function RemoveUnholy(uuid) {
  UnholyEffects.forEach(async element => {
    let hasEffectApplied = await game.dfreds.effectInterface.hasEffectApplied(element, uuid);
    if (hasEffectApplied) {
      game.dfreds.effectInterface.removeEffect({ effectName: element, uuid });
    }
  });
}

async function HolyFunction(totalResult, uuid) {
  switch (totalResult) {
    case 0:
      await RemoveHoly(uuid);
      break;
    case 1:
      await RemoveHoly(uuid);
      await game.dfreds.effectInterface.addEffect({ effectName: "Holy-", uuid });
      break;
    case 2:
      await RemoveHoly(uuid);
      await game.dfreds.effectInterface.addEffect({ effectName: "Holy--", uuid });
      break;
    case -1:
      await RemoveHoly(uuid);
      await game.dfreds.effectInterface.addEffect({ effectName: "Holy+", uuid });
      break;
    case -2:
      await RemoveHoly(uuid);
      await game.dfreds.effectInterface.addEffect({ effectName: "Holy++", uuid });
      break;
    default:
      return;
  }
}

async function UnholyFunction(totalResult, uuid) {
  switch (totalResult) {
    case 0:
      await RemoveUnholy(uuid);
      break;
    case -1:
      await RemoveUnholy(uuid);
      await game.dfreds.effectInterface.addEffect({ effectName: "Unholy-", uuid });
      break;
    case -2:
      await RemoveUnholy(uuid);
      await game.dfreds.effectInterface.addEffect({ effectName: "Unholy--", uuid });
      break;
    case 1:
      await RemoveUnholy(uuid);
      await game.dfreds.effectInterface.addEffect({ effectName: "Unholy+", uuid });
      break;
    case 2:
      await RemoveUnholy(uuid);
      await game.dfreds.effectInterface.addEffect({ effectName: "Unholy++", uuid });
      break;
    default:
      return;
  }
}

async function VersatileFunction(totalResult, uuid) {
  switch (totalResult) {
    case 0:
      await RemoveHoly(uuid);
      await RemoveUnholy(uuid);
      break;
    case -1:
      await RemoveHoly(uuid);
      await RemoveUnholy(uuid);
      await game.dfreds.effectInterface.addEffect({ effectName: "Unholy-", uuid });
      await game.dfreds.effectInterface.addEffect({ effectName: "Holy+", uuid });
      break;
    case -2:
      await RemoveHoly(uuid);
      await RemoveUnholy(uuid);
      await game.dfreds.effectInterface.addEffect({ effectName: "Unholy--", uuid });
      await game.dfreds.effectInterface.addEffect({ effectName: "Holy++", uuid });
      break;
    case 1:
      await RemoveHoly(uuid);
      await RemoveUnholy(uuid);
      await game.dfreds.effectInterface.addEffect({ effectName: "Unholy+", uuid });
      await game.dfreds.effectInterface.addEffect({ effectName: "Holy-", uuid });
      break;
    case 2:
      await RemoveHoly(uuid);
      await RemoveUnholy(uuid);
      await game.dfreds.effectInterface.addEffect({ effectName: "Unholy++", uuid });
      await game.dfreds.effectInterface.addEffect({ effectName: "Holy--", uuid });
      break;
    default:
      return;
  }
}