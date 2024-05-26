import React from 'react'
import { useForm } from 'react-hook-form'
import './form.css'

const form = ({ onSubmit }) => {
  const { handleSubmit, register, formState } = useForm({
    defaultValues: {
      playerX: '',
      ageX: '',
      playerO: '',
      ageO: ''
    }
  })

  const handleFormSubmit = handleSubmit((data) => {
    onSubmit(data)
  })

  return (
    <form onSubmit={handleFormSubmit}>
      <label htmlFor='playerX'>Player 1: </label>
      <input
        {...register('playerX', {
          required: true,
          pattern: {
            value: /^[a-zA-Z]{3,}$/,
            message:
              'The username must have at least 3 characters and can only contain uppercase and lowercase letters.'
          }
        })}
        type='text'
        id='playerX'
      />
      {formState.errors.playerX ? (
        <p>{formState.errors.playerX.message}</p>
      ) : null}
      <label htmlFor='ageX'>Age: </label>
      <input
        {...register('ageX', {
          required: true,
          pattern: {
            value: /^(1[89]|[2-9]\d)$/,
            message: 'You must be 18 years or older to play.'
          }
        })}
        type='number'
        id='ageX'
      />
      {formState.errors.ageX ? <p>{formState.errors.ageX.message}</p> : null}
      <label htmlFor='playerO'>Player 2: </label>
      <input
        {...register('playerO', {
          required: true,
          pattern: {
            value: /^[a-zA-Z]{3,}$/,
            message:
              'The username must have at least 3 characters and can only contain uppercase and lowercase letters.'
          }
        })}
        type='text'
        id='playerO'
      />
      {formState.errors.playerO ? (
        <p>{formState.errors.playerO.message}</p>
      ) : null}
      <label htmlFor='ageO'>Age: </label>
      <input
        {...register('ageO', {
          required: true,
          pattern: {
            value: /^(1[89]|[2-9]\d)$/,
            message: 'You must be 18 years or older to play.'
          }
        })}
        type='number'
        id='ageO'
      />
      {formState.errors.ageO ? <p>{formState.errors.ageO.message}</p> : null}
      <button disabled={!formState.isDirty} type='submit'>
        Enviar
      </button>
    </form>
  )
}

export default form
