import { useStore } from "@nanostores/preact";
import { tagsSelected } from "../tagStore";

export default function Tags({ skills }) {
  const $tagsSelected = useStore(tagsSelected);
  return (
    <div class="flex gap-1 flex-wrap print:hidden">
      {skills.map((skill) => {
        const isSelected = $tagsSelected.includes(skill);
        return (
          <span
            class={`badge cursor-pointer ${isSelected ? "badge-primary" : ""}`}
            onClick={() => {
              tagsSelected.set(
                isSelected
                  ? $tagsSelected.filter((s) => s !== skill)
                  : [...$tagsSelected, skill]
              );
            }}
          >
            {skill}
          </span>
        );
      })}
    </div>
  );
}
