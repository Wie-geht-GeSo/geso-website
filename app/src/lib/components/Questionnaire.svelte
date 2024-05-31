<script lang="ts">
	import type { Questionnaire } from '$lib/types/Questionnaire';
	import { Stepper, Step, ProgressRadial, getModalStore } from '@skeletonlabs/skeleton';
	const modalStore = getModalStore();
	export let data: Questionnaire;

	// This will store the selected options or answers for each question
	let answers: { [key: string]: string[] } = {};

	let searchPerformed = false;
	let searchLoading = false;
	let results: any = '';
	async function search(searchTerm: string): Promise<void> {
		if (!searchTerm.trim()) return;

		searchLoading = true;
		try {
			const response = await fetch(`/api/search?query=${encodeURIComponent(searchTerm)}`);
			results = await response.json(); // Use the array of {title, slug}
		} catch (error) {
			console.error("Couldn't reach search api: ", error);
			results = [];			
			searchLoading = false;
			searchPerformed = true;
		} finally {
			searchLoading = false;
			searchPerformed = true;
		}
	}

	function resetSearch() {
		searchPerformed = false;
		searchLoading = false;
		results = [];
	}

	function toggleOption(toSearch: string, option: string, isSingleChoice: boolean) {
		if (!answers[toSearch]) {
			answers[toSearch] = [];
		}

		if (isSingleChoice) {
			answers[toSearch] = [option];
		} else {
			if (!answers[toSearch]) {
				answers[toSearch] = [];
			}
			const index = answers[toSearch].indexOf(option);
			if (index === -1) {
				answers[toSearch].push(option);
			} else {
				answers[toSearch].splice(index, 1);
			}
		}
	}

	function getAnswer(answers: any, toSearch: string) {
		if (!answers[toSearch]) {
			return undefined;
		} else {
			return answers[toSearch][0];
		}
	}

	function buildSearchTerm(answers: { [key: string]: string[] }): string {
		let searchTerm = '';

		Object.keys(answers).forEach((key, index) => {
			const answerList = answers[key].join(', ');
			searchTerm += `${key} ${answerList}`;
			if (index < Object.keys(answers).length - 1) {
				searchTerm += ' und ';
			}
		});

		return searchTerm.toLowerCase();
	}

	function handleTextChange(toSearch: string, event: Event) {
		const input = event.target as HTMLInputElement;
		answers[toSearch] = [input.value.replace(/<[^>]*>?/gm, '')]; // Sanitizing input
	}

	async function completeQuestionnaire() {
		let searchTerm = buildSearchTerm(answers);
		await search(searchTerm);
	}
</script>

{#if !searchLoading && !searchPerformed}
	<Stepper
		activeStep={0}
		on:complete={completeQuestionnaire}
		class="border-2 border-primary-500 rounded-lg p-5"
		stepTerm=""
	>
		{#each data.questions as question, index (question.id)}
			<Step
				stepTerm="Frage"
				buttonBackLabel="Zurück"
				buttonNextLabel="Weiter"
				,
				buttonCompleteLabel="Abschließen"
			>
				<div class="flex justify-between items-center">
					<div class="flex-1 mr-5">
						<h1 class="text-lg font-semibold text-primary-600 mb-2">
							{question.question}
						</h1>
					</div>
					<div class="flex-1">
						{#if question.questionType === 'multipleChoice'}
							{#each question.options as option}
								<div class="mb-2">
									<input
										type="checkbox"
										id={`option-${option.id}`}
										checked={answers[question.searchFormulation]?.includes(option.option) || false}
										on:change={() => toggleOption(question.searchFormulation, option.option, false)}
										class="mr-2 accent-primary-500"
									/>
									<label for={`option-${option.id}`}>{option.option}</label>
								</div>
							{/each}
						{:else if question.questionType === 'singleChoice'}
							{#each question.options as option}
								<div class="mb-2">
									<input
										type="radio"
										name={`single-choice-${question.id}`}
										id={`option-${option.id}`}
										value={option.option}
										checked={getAnswer(answers, question.searchFormulation) === option.option}
										on:change={() => toggleOption(question.searchFormulation, option.option, true)}
										class="mr-2 accent-primary-500"
									/>
									<label for={`option-${option.id}`}>{option.option}</label>
								</div>
							{/each}
						{:else if question.questionType === 'openAnswer'}
							<div class="mb-2">
								<input
									type="text"
									id={`open-answer-${question.id}`}
									value={answers[question.searchFormulation] || ''}
									on:input={(event) => handleTextChange(question.searchFormulation, event)}
									class="border-2 border-primary-500 rounded-lg p-2 w-full text-black"
								/>
							</div>
						{/if}
					</div>
				</div>
			</Step>
		{/each}
	</Stepper>
	<!-- Render custom Complete button if there's only one question -->
	{#if data.questions.length === 1}
		<div class="flex justify-end mt-4">
			<button
				on:click={completeQuestionnaire}
				class="bg-primary-500 text-white rounded-lg px-4 py-2"
			>
				Abschließen
			</button>
		</div>
	{/if}
{:else if searchLoading}
	<div class="flex justify-center">
		<ProgressRadial width="w-16" />
	</div>
{:else if results.length > 0}
	<div class="border-2 border-primary-500 rounded-lg p-5">
		<h2 class="text-center text-2xl font-bold text-primary-500 mb-4">Ergebnisse</h2>
		<div class="w-full h-0.5 bg-primary-500 mb-4" />
		<nav>
			<ul>
				{#each results.slice(0, 4) as result}
					<li class="group hover:variant-soft py-2 px-4 rounded-md">
						<a href={`/${result.slug}`} on:click={() => modalStore.close()}>
							<div class="flex items-center">
								<i class="fa-regular fa-file text-secondary-800 mr-2" />
								<div>
									<span class="block text-xl text-primary-800">{result.title}</span>
									<span class="block text-lg accent-primary-500 group-hover:accent-secondary-500"
										>{result.subTitle || ''}</span
									>
								</div>
							</div>
						</a>
					</li>
				{/each}
			</ul>
		</nav>
		<div class="flex justify-center mt-4">
			<button
				on:click={resetSearch}
				class="bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-700"
			>
				Zurück
			</button>
		</div>
	</div>
{:else if results.length == 0 && searchPerformed}
	<div class="border-2 border-primary-500 rounded-lg p-5">
		<h2 class="text-center text-2xl font-bold text-primary-500 mb-4">Ergebnisse</h2>
		<div class="w-full h-0.5 bg-primary-500 mb-4" />

		<p class= "block text-lg accent-primary-500">Wir konnten leider keinen passenden Artikel zu Ihrer Suchanfrage finden. Bitte verwenden Sie die Zurück-Taste, um den Fragebogen erneut auszufüllen.</p>

		<div class="flex justify-center mt-4">
			<button
				on:click={resetSearch}
				class="bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-700"
			>
				Zurück
			</button>
		</div>
	</div>
{/if}
