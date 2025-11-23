<template>
	<div class="search-bar">
		<input
			:value="modelValue"
			class="search-input"
			type="search"
			:placeholder="placeholder"
			@input="onInput"
			@keyup.escape="emit('update:modelValue', '')"
		/>
		<button v-if="modelValue" class="clear-btn" type="button" @click="emit('update:modelValue', '')">
			×
		</button>
	</div>
</template>

<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		modelValue: string;
		placeholder?: string;
	}>(),
	{
		modelValue: '',
		placeholder: '搜索应用或标签…'
	}
);

const emit = defineEmits<{ 'update:modelValue': [value: string] }>();

const onInput = (event: Event) => {
	const target = event.target as HTMLInputElement;
	emit('update:modelValue', target.value);
};
</script>

<style scoped>
.search-bar {
	position: relative;
	display: flex;
	align-items: center;
	width: 280px;
	max-width: 100%;
}

.search-input {
	width: 100%;
	padding: 10px 36px 10px 14px;
	border-radius: 14px;
	border: 1px solid var(--color-border);
	background: rgba(255, 255, 255, 0.8);
	backdrop-filter: blur(6px);
	font-size: 14px;
	outline: none;
	transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.search-input:focus {
	border-color: var(--color-primary);
	box-shadow: 0 0 0 3px var(--color-primary-soft);
}

.clear-btn {
	position: absolute;
	right: 10px;
	border: none;
	background: transparent;
	font-size: 18px;
	line-height: 1;
	cursor: pointer;
	color: rgba(27, 36, 48, 0.55);
}

:deep(body[data-theme='dark']) .search-input {
	background: rgba(30, 32, 38, 0.9);
	border-color: var(--color-border-dark);
	color: var(--color-text-dark);
}
</style>
