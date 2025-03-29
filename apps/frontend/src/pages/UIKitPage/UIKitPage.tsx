import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import AuthBar from '../../components/modules/Auth/AuthBar/AuthBar';
import { UserCard } from '../../components/modules/UserCard/UserCard';
import Button from '../../components/ui/Button/Button';
import ButtonWithIcon from '../../components/ui/ButtonWithIcon/ButtonWithIcon';
import ButtonWithNumber from '../../components/ui/ButtonWithNumber/ButtonWithNumber';
import ConnectionsUserCard from '../../components/ui/ConnectionsUserCard/ConnectionsUserCard';
import IngredientCard from '../../components/ui/IngredientCard/IngredientCard';
import Logo from '../../components/ui/Logo/Logo';
import MainTitle from '../../components/ui/MainTitle/MainTitle';
import Navigation from '../../components/ui/Navigation/Navigation';
import Paging from '../../components/ui/Paging/Paging';
import PathInfo from '../../components/ui/PathInfo/PathInfo';
import RecipeCard from '../../components/ui/RecipeCard/RecipeCard';
import SubTitle from '../../components/ui/SubTitle/SubTitle';
import UploadRecipePhoto from '../../components/ui/UploadRecipePhoto/UploadRecipePhoto';

import styles from './UIKitPage.module.css';

const UIKitPage = () => {
  const [text, setText] = useState(
    'Is a healthy salad recipe that’s big on nutrients and flavor. ',
  );
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [text]);

  useEffect(() => {
    window.addEventListener('resize', adjustHeight);
    return () => window.removeEventListener('resize', adjustHeight);
  }, []);

  const ingredientsProps = [
    {
      ingredient: {
        id: '640c2dd963a319ea671e36f9',
        name: 'Gruyère',
        imageUrl:
          'https://ftp.goit.study/img/so-yummy/ingredients/640c2dd963a319ea671e36f9.png',
        measure: '3',
      },
      onDelete: () =>
        console.log(`Delete ingredient with id: ${'640c2dd963a319ea671e36f9'}`),
    },
    {
      ingredient: {
        id: '640c2dd963a319ea671e37f5',
        name: 'Cabbage',
        imageUrl:
          'https://ftp.goit.study/img/so-yummy/ingredients/640c2dd963a319ea671e37f5.png',
        measure: '400 g',
      },
    },
  ];

  return (
    <div className={styles.kitContainer}>
      <h1>UI Kit</h1>
      <div>
        <h2 className={styles.kitTitle}>Buttons</h2>
        <div className={styles.kitCard}>
          <Button kind="primary" type="submit">
            Publish
          </Button>
          <Button kind="secondary" type="submit">
            Add recipe
          </Button>
          <Button kind="primary" type="submit" disabled={true}>
            Add recipe
          </Button>
        </div>
        <div className={styles.kitCard}>
          <Button kind="primary" size="small" type="submit">
            Publish
          </Button>
          <Button kind="secondary" size="small" type="submit">
            Add recipe
          </Button>
          <Button kind="secondary" size="small" type="submit" disabled={true}>
            Add recipe
          </Button>
        </div>
        <div className={styles.kitCard}>
          <Button kind="text" type="button">
            Sign in
          </Button>
        </div>
      </div>
      <div>
        <h2 className={styles.kitTitle}>Buttons</h2>
        <div className={styles.kitCard}>
          <ButtonWithIcon
            kind="primary"
            size="large"
            type="submit"
            iconType="icon-heart"
          />
          <ButtonWithIcon
            kind="secondary"
            size="large"
            type="submit"
            iconType="icon-trash"
          />
          <ButtonWithIcon
            kind="secondary"
            size="large"
            type="submit"
            iconType="icon-trash"
            disabled={true}
          />
          <ButtonWithNumber kind="inactive" type="button" number="1" />
          <ButtonWithNumber kind="active" type="button" number="2" />
        </div>
        <div className={styles.kitCard}>
          <ButtonWithIcon kind="primary" type="submit" iconType="icon-heart" />
          <ButtonWithIcon
            kind="secondary"
            type="submit"
            iconType="icon-minus"
          />
          <ButtonWithIcon
            kind="primary"
            type="submit"
            disabled={true}
            iconType="icon-plus"
          />
          <ButtonWithNumber kind="active" type="button" number="1" />
        </div>
        <div className={styles.kitCard}>
          <ButtonWithIcon
            kind="primary"
            size="small"
            type="submit"
            iconType="icon-arrow-up-right"
          />
          <ButtonWithIcon
            kind="secondary"
            size="small"
            type="submit"
            iconType="icon-heart"
          />
          <ButtonWithIcon
            kind="secondary"
            size="small"
            type="submit"
            iconType="icon-heart"
            disabled={true}
          />
          <ButtonWithNumber kind="active" type="button" number="1" />
        </div>
        <div className={clsx(styles.kitCard, styles.kitCardDark)}>
          <ButtonWithIcon
            kind="ghost"
            size="large"
            type="submit"
            iconType="icon-heart"
          />
        </div>
      </div>
      <div>
        <h2 className={styles.kitTitle}>Logo</h2>
        <div className="flex gap4">
          <div className={styles.kitCard}>
            <Logo isInversed={false} />
          </div>
          <div className={clsx(styles.kitCard, styles.kitCardDark)}>
            <Logo isInversed={true} />
          </div>
        </div>
      </div>
      <div>
        <h2 className={styles.kitTitle}>Navigation</h2>
        <div className="flex gap4">
          <div className={styles.kitCard}>
            <Navigation isInversed={false} />
          </div>
          <div className={clsx(styles.kitCard, styles.kitCardDark)}>
            <Navigation isInversed={true} />
          </div>
        </div>
      </div>
      <div>
        <h2 className={styles.kitTitle}>AuthBar</h2>
        <div className={clsx(styles.kitCard, styles.kitCardDark)}>
          <AuthBar userSignedIn={false} />
        </div>
      </div>
      <div>
        <h2 className={styles.kitTitle}>Input</h2>
        <div className={clsx(styles.kitCard)}>
          <div className="inputWrapper inputWrapperFilled">
            <input
              className="input"
              value="Julia"
              type="text"
              placeholder="Name*"
            />
          </div>
          <div className="inputWrapper">
            <input className="input" type="text" placeholder="Name*" />
          </div>
          <div className="inputWrapper inputWrapperInvalid">
            <input className="input" type="text" placeholder="Name*" />
          </div>
          <div className="inputWrapper inputWrapperInvalid">
            <input className="input" type="text" placeholder="Name*" />
            <span className="inputError">Name is required</span>
          </div>
        </div>

        <div>
          <h2 className={styles.kitTitle}>Input</h2>
          <div className={clsx(styles.kitCard)}>
            <div className="inputTitleWrapper">
              <input
                className="input"
                type="text"
                placeholder="The name of the recipe"
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <h2 className={styles.kitTitle}>TextArea with count</h2>
        <div className={clsx(styles.kitCard)}>
          <div className="textAreaWrapper textAreaWrapperCounter">
            <textarea
              className="textArea"
              ref={textareaRef}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
              }}
              maxLength={200}
              rows={1}
              placeholder="Enter a description"
            />
            <div className="textAreaCounter">
              <span className={text.length ? 'textAreaCounterCurrent' : ''}>
                {text.length}
              </span>
              <span>/200</span>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h2 className={styles.kitTitle}>TextArea</h2>
        <div className={clsx(styles.kitCard)}>
          <div className="textAreaWrapper">
            <textarea
              className="textArea"
              rows={1}
              placeholder="Enter quantity"
            />
          </div>
          <div className="textAreaWrapper textAreaWrapperInvalid">
            <textarea
              className="textArea"
              rows={1}
              placeholder="Enter quantity"
            />
            <span className="textAreaError">Quantity isrequired</span>
          </div>
        </div>
      </div>
      <div>
        <h2 className={styles.kitTitle}>Main Title/Sub Title</h2>
        <div className={clsx(styles.kitCard)}>
          <div className="flex column">
            <MainTitle title="Categories" />
            <SubTitle title="Discover a limitless world of culinary possibilities and enjoy exquisite recipes that combine taste, style and the warm atmosphere of the kitchen." />
          </div>
        </div>
      </div>
      <div>
        <h2 className={styles.kitTitle}>Path Info</h2>
        <div className={clsx(styles.kitCard)}>
          <PathInfo
            pages={[
              { name: 'Home', path: '/' },
              { name: 'Add Recipe', path: '/add-recipe' },
            ]}
          />
        </div>
      </div>
      <div>
        <h2 className={styles.kitTitle}>Recipe photo uploader</h2>
        <div className={clsx(styles.kitCard, styles.kitCardWidth)}>
          <UploadRecipePhoto />
        </div>
      </div>
      <div>
        <h2 className={styles.kitTitle}>Recipe Card</h2>
        <div className={clsx(styles.kitCard, styles.kitCardRecipe)}>
          <RecipeCard
            recipe={{
              id: '6462a8f74c3d0ddd28897fcd',
              title: 'Battenberg Cake',
              description:
                'A classic British cake made with almond sponge cake and covered with marzipan. It is traditionally pink and yellow checkered in appearance.',
              thumb:
                'https://ftp.goit.study/img/so-yummy/preview/Battenberg%20Cake.jpg',
              owner: {
                userId: '64c8d958249fae54bae90bb7',
                name: 'Larry Pageim',
                avatarUrl:
                  '//www.gravatar.com/avatar/5d5a7360e20c02ea336f0440a148e8bf?s=200&r=pg&d=retro',
              },
              category: {
                categoryId: '6462a6cd4c3d0ddd28897f8f',
                categoryName: 'Dessert',
              },
              area: {
                areaId: '6462a6f04c3d0ddd28897fa1',
                areaName: 'British',
              },
            }}
            isFavorite={false}
            onOpenProfile={() =>
              console.log(
                `Check auth and open a profile for user '64c8d958249fae54bae90bb7'`,
              )
            }
            onToggleFavorite={() =>
              console.log('Check auth and toggle favorite')
            }
            onOpenRecipe={() => console.log('Open a recipe')}
          />
        </div>
      </div>
      <div>
        <h2 className={styles.kitTitle}>Ingredient Card</h2>
        <div className={clsx(styles.kitCard)}>
          {ingredientsProps.map((props) => (
            <IngredientCard key={props.ingredient.id} {...props} />
          ))}
        </div>
      </div>
      <div>
        <h2 className={styles.kitTitle}>Paging</h2>
        <div className={styles.kitCard}>
          <Paging totalPages={20} />
        </div>
      </div>
      <div>
        <h2 className={styles.kitTitle}>Connection user card</h2>
        <div className={clsx(styles.kitCard, styles.kitCardConnections)}>
          <ConnectionsUserCard
            user={{
              id: '1',
              name: 'John Doe',
              email: 'jane@example.com',
              avatarUrl:
                'https://images.pexels.com/photos/4253298/pexels-photo-4253298.jpeg?auto=compress&cs=tinysrgb&w=300',
              recipesCount: 5,
              recipes: [
                {
                  id: '6462a8f74c3d0ddd288980b7',
                  title: 'Fennel Dauphinoise',
                  thumb:
                    'https://ftp.goit.study/img/so-yummy/preview/Fennel%20Dauphinoise.jpg',
                },
                {
                  id: '6462a8f74c3d0ddd288980a6',
                  title: 'Ful Medames',
                  thumb:
                    'https://ftp.goit.study/img/so-yummy/preview/Ful%20Medames.jpg',
                },
                {
                  id: '6462a8f74c3d0ddd28897ff5',
                  title: 'Laksa King Prawn Noodles',
                  thumb:
                    'https://ftp.goit.study/img/so-yummy/preview/Laksa%20King%20Prawn%20Noodles.jpg',
                },
                {
                  id: '6462a8f74c3d0ddd288980cf',
                  title: 'Chick-Fil-A Sandwich',
                  thumb:
                    'https://ftp.goit.study/img/so-yummy/preview/Chick-Fil-A%20Sandwich.jpg',
                },
                {
                  id: '6462a8f74c3d0ddd288980b3',
                  title: 'Walnut Roll Gužvara',
                  thumb:
                    'https://ftp.goit.study/img/so-yummy/preview/Walnut%20Roll%20Gužvara.jpg',
                },
              ],
              following: false,
            }}
            onUserChange={() => {
              /* do nothing */
            }}
          />
          <ConnectionsUserCard
            user={{
              id: '1',
              name: 'Jane Doe',
              email: 'jane@example.com',
              avatarUrl:
                'https://images.pexels.com/photos/3785708/pexels-photo-3785708.jpeg?auto=compress&cs=tinysrgb&w=600',
              recipesCount: 10,
              recipes: [
                {
                  id: '6462a8f74c3d0ddd288980a0',
                  title: 'Madeira Cake',
                  thumb:
                    'https://ftp.goit.study/img/so-yummy/preview/Madeira%20Cake.jpg',
                },
                {
                  id: '6462a8f74c3d0ddd288980b4',
                  title: 'Nasi lemak',
                  thumb:
                    'https://ftp.goit.study/img/so-yummy/preview/Nasi%20lemak.jpg',
                },
                {
                  id: '6462a8f74c3d0ddd28898043',
                  title: "General Tso's Chicken",
                  thumb:
                    'https://ftp.goit.study/img/so-yummy/preview/General%20Tso_s%20Chicken.jpg',
                },
              ],
              following: true,
            }}
            onUserChange={() => {
              /* do nothing */
            }}
          />
        </div>
      </div>

      <div className={styles.kitCard}>
        <UserCard
          name="Victoria"
          email="victoria28682@gmail.com"
          avatar={undefined}
          recipesCount={9}
          favoritesCount={9}
          followersCount={5}
          followingCount={5}
        />
      </div>
    </div>
  );
};

export default UIKitPage;
