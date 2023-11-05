import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  useGetRecordByIdQuery,
  useCreateRecordMutation,
  useUpdateRecordMutation,
  useDeleteRecordMutation
} from '../store/api/server.api.ts';

import { IRecord } from '../models/models.ts';

import Input from '../components/ui/Input.tsx';
import Button from '../components/ui/Button.tsx';

export default function Record() {
  const { id } = useParams();

  const isEditing = !!id;

  const { data, isLoading, isError } = useGetRecordByIdQuery(id || '', {
    skip: !isEditing,
  });

  const initialData = {
    id: '',
    email: '',
    profile: {
      name: '',
      country: '',
      state: '',
    },
    createdAt: '',
    updatedAt: ''
  };

  const [createRecordMutation] = useCreateRecordMutation();
  const [updateRecordMutation] = useUpdateRecordMutation();
  const [deleteRecordMutation] = useDeleteRecordMutation();

  const [formData, setFormData] = useState<IRecord>(initialData);

  useEffect(() => {
    if (data && Array.isArray(data) && isEditing) {
      setFormData(data[0]);
    }
  }, [data, isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.includes('profile.')) {
      const profileName = name.split('profile.')[1];
      setFormData({
        ...formData,
        profile: {
          ...formData.profile,
          [profileName]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleCreate = async () => {
    const recordData = {
      ...formData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const response = await createRecordMutation({
      data: recordData
    });
    if ('error' in response) {
      console.error('Ошибка при создании записи', response.error)
    } else {
      console.log('Запись успешно создана', response.data);
    }
  };

  const handleUpdate = async () => {
    if (id) {
      try {
        const response = await updateRecordMutation({
          id,
          data: formData,
        });

        if ('error' in response) {
          console.error('Ошибка при обновлении записи', response.error);
        } else {
          console.log('Запись успешно обновлена', response.data);
        }
      } catch (error) {
        console.error('Ошибка при отправке запроса', error);
      }
    }
  };

  const handleDelete = async () => {
    if (id) {
      try {
        const response = await deleteRecordMutation(id);

        if ('error' in response) {
          console.log('Запись успешно удалена');
        }

      } catch (error) {
        console.error('Ошибка при отправке запроса', error);
      }
    }
  };

  return (
    <div className="flex justify-center pt-10 mx-auto h-screen w-3/6">
      {isError && <h1 className="text-red">Something went wrong...</h1>}
      <div className="flex items-start flex-col w-[80%]">
        {isLoading ? (
          <h1 className="text-red">Loading...</h1>
        ) : (
          <div className="flex flex-col w-full">
            <h2 className="font-bold mb-4">
              {!isEditing ? '' : formData.id}
            </h2>
            <Input
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              label="Email"
            />
            <Input
              name="profile.name"
              value={formData.profile.name}
              onChange={handleInputChange}
              label="Name"
            />
            <Input
              name="profile.country"
              value={formData.profile.country}
              onChange={handleInputChange}
              label="Country"
            />
            <Input
              name="profile.state"
              value={formData.profile.state}
              onChange={handleInputChange}
              label="State"
            />
            <div className="flex justify-between">
              {
                isEditing
                  ? <>
                    <Button
                      type="submit"
                      onClick={handleUpdate}
                    >
                      Submit
                    </Button>
                    <Button
                      type="button"
                      onClick={handleDelete}
                    >
                      Delete
                    </Button>
                  </>
                  : <Button
                    type="button"
                    onClick={handleCreate}
                  >
                    Create
                  </Button>
              }
            </div>
          </div>
        )}
      </div>
    </div>
  )
}